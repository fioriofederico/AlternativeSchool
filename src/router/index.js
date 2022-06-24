import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '@/store'

import {
	beforeResolve
} from './routeBeforeResolve'

Vue.use(VueRouter);

// configure router
const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes, // short for routes: routes
	linkActiveClass: 'vsm--link_active vsm--link_exact-active',
	scrollBehavior: (to, from, savedPosition) => {
		if (savedPosition) {
			return savedPosition;
		}
		if (to.hash) {
			return {
				selector: to.hash
			};
		}
		return {
			x: 0,
			y: 0
		};
	}
});


// ----------------------------------------------------------------

router.beforeResolve((to, from, next) => {
	beforeResolve(to, next);
})

// ----------------------------------------------------------------

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
	// This goes through the matched routes from last to first, finding the closest route with a title.
	// eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
	const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

	// Find the nearest route element with meta tags.
	const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
	from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

	// If a route with a title was found, set the document (page) title to that value.
	if (nearestWithTitle) {
			const appTitle = document.title;
			document.title = `${nearestWithTitle.meta.title} | ${appTitle}`;
		// Imposta i nome della pagina e la relativa icon se esiste.
		// Controlla prima se sono state settate nel realtivo component, altrimenti
		// prendi i valori espressi nella meta delle route
		if (store.pageName == null) {
			store.dispatch('pageName', nearestWithTitle.meta.pageName)
		}
		if (store.pageIcon == null) {
			store.dispatch('pageIcon', nearestWithTitle.meta.icon)
		}
	}

	// Remove any stale meta tags from the document using the key attribute we set below.
	Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

	// Skip rendering meta tags if there are none.
	if (!nearestWithMeta) return next();

	// Turn the meta tag definitions into actual elements in the head.
	nearestWithMeta.meta.metaTags.map(tagDef => {
			const tag = document.createElement('meta');

			Object.keys(tagDef).forEach(key => {
				tag.setAttribute(key, tagDef[key]);
			});

			// We use this to track which meta tags we create, so we don't interfere with other ones.
			tag.setAttribute('data-vue-router-controlled', '');

			return tag;
		})
		// Add the meta tags to the document head.
		.forEach(tag => document.head.appendChild(tag));

	next();
});

// ----------------------------------------------------------------

export default router;