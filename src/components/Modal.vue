<template>
	<b-modal
		:id="id"
		:title="title"
		:size="modalSize"
		:header-bg-variant="headerBgVar"
		:header-text-variant="headerTxtVar"
		:no-enforce-focus="noEnforceFocus"
		:no-close-on-backdrop="noCloseBackDrop"
		:hide-footer="hideFooter"
		@hide="resetInfoModal"
	>
		<slot v-for="(_, name) in $slots" :name="name" :slot="name" />
	</b-modal>
</template>

<script>
import { bus } from '@/main';
export default {
	name: 'Modal',
	props: {
		id: {
			type: String,
			default: 'crudModal'
		},
		title: {
			type: String,
			required: true
		},
		size: {
			type: String,
			default: 'lg'
		},
		headerBgVar: {
			type: String,
			default: 'dark'
		},
		headerTxtVar: {
			type: String,
			default: 'light'
		},
		modalSize: {
			type: String,
			default: 'lg'
		},
		noEnforceFocus: {
			type: Boolean,
			default: true
		},
		noCloseBackDrop: {
			type: Boolean,
			default: true
		},
		hideFooter: {
			type: Boolean,
			default: true
		},
		resetInfoModal: {
			type: Function,
			default: () => {}
		},
	},
	mounted() {
		// Resta in ascolto dell'event bus modalEvent richiamato dai songoli
		// components
		bus.$on('modalEvent', (event) => {
			switch (event) {
				case 'close':
					this.$root.$emit('bv::hide::modal', this.id)
					break;

				case 'show':
					this.$root.$emit('bv::show::modal', this.id)
					break;

				default:
					break;
			}
		});
	},
}
</script>

<style>

</style>