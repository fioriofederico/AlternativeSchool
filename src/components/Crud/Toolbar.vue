<template>
	<div class="toolbar my-3 d-flex justify-content-between">
		<div class="toolbar--item toolbar-filters toolbar-left">
			<slot name="filterButton" v-if="tools.filterOn">
				<b-button
					:size="buttonSize"
					:variant="filterButton.variant"
					:title="filterButton.text"
					v-b-toggle="filtersWrapId"
					squared
					v-b-tooltip.hover
				>
					<font-awesome-icon class="toolbar-button toolbar-button--filter" :icon="filterButton.icon" />
				</b-button>
			</slot>
			<slot name="leftButton">
        <router-link :to="addressBackTo || tools.backPageAddress"><b-button
            v-if="tools.backPage"
            :size="buttonSize"
            :variant="'info'"
            :title="'Torna alla Pagina Precedente'"
            squared
            v-b-tooltip.hover
        >
          <font-awesome-icon class="toolbar-button toolbar-button--filter" icon="arrow-left" />
        </b-button></router-link>
      </slot>
		</div>
		<div class="toolbar--item toolbar-action toolbar-right">

			<slot name="rightButton">
				<b-button v-if="tools.refreshOn" squared :size="buttonSize" variant="primary" v-b-tooltip.hover
					title="Aggiorna lista" @click="$root.$emit('bv::refresh::table', idTable)">
					<font-awesome-icon class="toolbar-button toolbar-button--filter" icon="redo-alt" />
				</b-button>

				<b-button
					v-if="tools.createOn"
					title="Aggiungi"
					data-crud="create"
					variant="success"
					:size="buttonSize"
					@click="info(null, null, $event)"
					squared
					v-b-tooltip.hover
				>
					<font-awesome-icon class="toolbar-button toolbar-button--create" icon="plus"  filtri/>
				</b-button>

				<b-button v-if="tools.deleteOn && bulk" :size="buttonSize" variant="danger" squared data-crud="create"
					v-b-tooltip.hover title="Cancella selezione">
					<font-awesome-icon class="toolbar-button toolbar-button--create" icon="trash-alt"  filtri/>
				</b-button>
			</slot>

			<slot name="extraBulk"></slot>
		</div>
	</div>
</template>

<script>

	export default {
		props: {
			info: Function,
			idTable: {
				type: String,
				default: 'crudTable'
			},
      addressBackTo: String,
			bulk: Boolean,
			tools: Object,
			filtersWrap: {
				type: String,
				default: null
			}
		},
		data() {
			return {
				buttonSize: 'md',
				filterButton: {
					isOpen: false,
					text: 'Filtra',
					icon: 'filter',
					variant: 'warning'
				}
			}
		},
		computed: {
			filtersWrapId() {
				return this.filtersWrap != null ? this.filtersWrap : 'filtersWrap';
			}
		},
		mounted() {
			// Controllo sul filter collapse
			this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
				if (collapseId == this.filtersWrapId && isJustShown) {
					this.filterButton = {
						isOpen: true,
						text: 'Chiudi',
						icon: 'times',
						variant: 'danger'
					}
				} else {
					this.filterButton = {
						isOpen: false,
						text: 'Filtra',
						icon: 'filter',
						variant: 'warning'
					}
				}
			})
		},
	}
</script>

<style>
	.toolbar-right button {
		margin-right: .2rem
	}

	.toolbar-right button:last-child {
		margin-right: 0;
	}
</style>
