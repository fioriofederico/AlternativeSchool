<template>
	<div id="app" class="app">
		<b-alert v-model="alert.show" class="position-fixed fixed-top m-0 rounded-0" style="z-index: 2000;"
			:variant="alert.variant" dismissible>
			{{this.alert.message}}
		</b-alert>

		<component :is="this.$route.meta.layout || 'div'">
			<router-view />
		</component>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'

	export default {
		computed: {
			...mapGetters({
				alert: 'alert',
			})
		},
	}
</script>

<style>
</style>
