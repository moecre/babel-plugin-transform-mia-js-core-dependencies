const _ = require('lodash');
const fs = require('fs');
let mappings;
let whitelistedSharedMembers;

module.exports = babel => {
    const t = babel.types;

    /**
     * Gets absolute file path for identity from mappings
     * @param {String} getter
     * @param {String} identity
     * @param {String} version
     * @returns {*}
     * @private
     */
    const _getAbsoluteFullPath = (getter, identity, version = '1.0') => {
        if (_.isUndefined(mappings[getter]) || _.isUndefined(mappings[getter][identity]) || _.isUndefined(mappings[getter][identity][version])) {
            return '';
        }
        return mappings[getter][identity][version];
    };

    return {
        visitor: {
            /**
             * Listen to CallExpression and replace Shared.x('identity') with a proper require() call
             * @param {Object} path
             * @param {Object} state
             * @constructor
             */
            CallExpression: (path, state) => {
                const {node} = path;
                const {callee} = node;

                if (_.isUndefined(callee.object) || _.isUndefined(callee.property)) {
                    return;
                }
                if (_.isUndefined(mappings)) {
                    // Load mappings

                    if (_.isUndefined(state.opts.mappingsFile)) {
                        return;
                    }
                    if (!fs.existsSync(state.opts.mappingsFile)) {
                        return;
                    }
                    mappings = require(state.opts.mappingsFile);

                    if (_.isUndefined(whitelistedSharedMembers)) {
                        // Load whitelist for Shared.x functions from mappings
                        whitelistedSharedMembers = Object.keys(mappings);
                    }
                }
                if (callee.object.name !== 'Shared' || whitelistedSharedMembers.indexOf(callee.property.name) === -1) {
                    return;
                }

                const absoluteFullPath = _getAbsoluteFullPath(callee.property.name, node.arguments[0].value);

                if (!absoluteFullPath) {
                    return;
                }

                // Do the actual replace
                path.replaceWith(
                    t.callExpression(
                        t.identifier('require'),
                        [t.stringLiteral(absoluteFullPath)]
                    )
                );
            }
        }
    };
};
