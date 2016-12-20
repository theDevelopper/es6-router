export default class Router {

    constructor(root) {
        this.root = root ? '/' + this.clearSlashes(root) + '/' : '/';
        this.routes = [];
        this.currentRoute = this.getFragment();
    }

    getFragment() {
        let fragment = '';

        const match = window.location.href.match(/#(.*)$/);
        fragment = match ? match[1] : '';
        
        console.log('router.getFragment: ', fragment);

        return this.clearSlashes(fragment);
    }

    clearSlashes(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }

    add(path, handler) {
        if (typeof path == 'function') {
            handler = path;
            path = '';
        }

        path = this.clearSlashes(path);

        const route = { path: path, handler: handler};
        this.routes.push(route);

        console.log('router.add: ', route);

        return this;
    }

    remove(param) {
        for (let i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
            if ( r.handler === param || r.path.toString() === param.toString()) {
                this.routes.splice(i, 1); 
                return this;
            }
        }
        return this;
    }

    flush() {
        this.routes = [];
        this.root = '/';
        return this;
    }

    check(fragment) {
        fragment = fragment || this.getFragment();

        for (let i = 0, max = this.routes.length; i < max; i++ ) {
            let routeParams = {}
            let keys = this.routes[i].path.match(/:([^\/]+)/g);
            let match = fragment.match(new RegExp(this.routes[i].path.replace(/:([^\/]+)/g, "([^\/]*)")));
            if (match) {
                match.shift();
                match.forEach(function (value, i) {
                    routeParams[keys[i].replace(":", "")] = value;
                });
                this.routes[i].handler.call({}, routeParams);
                return this;
            }
        }
        return this;
    }

    listen() {
        window.addEventListener('hashchange', (event) => {
            const fragment = this.getFragment();

            console.log('router::hashchange: ', fragment, this.currentRoute);
            if (this.currentRoute !== fragment) {
                this.currentRoute = fragment;
                this.check(this.currentRoute);
            }
        });

        return this;
    }

    navigate(path) {
        path = path || '';

        const newRoute = this.root + this.clearSlashes(path);
        window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        console.log('router.navigate: ', newRoute, location.pathname, newRoute == location.pathname);

        window.dispatchEvent(new Event('popstate'));
        return this;
    }
}
