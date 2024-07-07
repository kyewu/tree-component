module.exports = (request, options) => {
    return options.defaultResolver(request, {
        ...options,
        packageFilter: pkg => {
            const packageName = pkg.name;
            if (packageName === '@ag-grid-community/angular') {
                return {
                    ...pkg,
                };
            }
            const agDependency = packageName.startsWith("@ag-grid");
            return {
                ...pkg,
                // default to use the CommonJS ES5 entry point for Jest testing with AG Grid
                main: agDependency ? './dist/cjs/es5/main.js' : pkg.module || pkg.main,
            };
        },
    });
};