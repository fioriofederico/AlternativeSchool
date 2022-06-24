<template>
	<sidebar-menu
		:menu="menu"
		:width="sidebarWidth"
		:hideToggle="true"
		theme="white-theme"
		:collapsed="this.collapsed"
	>
		<!-- Dropdown Icon -->
		<span slot="toggle-icon">
			<i class="fas fa-arrows-alt-h"></i>
		</span>

		<span slot="dropdown-icon">
			<i class="fas fa-angle-right"></i>
		</span>

		<span slot="footer">
			<b-button-toolbar>
				<b-button
					variant="link"
					class="btn-collapse"
					v-b-tooltip.hover
					:title="!this.collapsed ? 'Riduci il menu' : 'Espandi il menu'"
					@click="collapse"
				>
					<font-awesome-icon
						:icon="!this.collapsed ? 'chevron-left' : 'chevron-right'"
						class="collapse-menu-icon text-dark"
					>
					</font-awesome-icon>
				</b-button>
			</b-button-toolbar>
		</span>
	</sidebar-menu>
</template>

<script>
	import {
		SidebarMenu
	} from 'vue-sidebar-menu'

	export default {
		props: ['sidebarWidth'],
		data() {
			return {
				collapsed: false
			}
		},
		computed: {
			menu() {
				return [{
						header: true,
						title: 'Menu',
						hiddenOnCollapse: true
					},
					{
						href: {
							name: 'allCourses'
						},
						title: 'Corsi',
						class: 'menu-icon',
						icon: 'fas fa-book',
            hidden: ['ROLE_TUTOR'].includes(this.$store.getters['auth/user'].role)
					},
					{
						href: {
							name: 'users'
						},
						title: 'Utenti',
						class: 'menu-icon',
						icon: 'fas fa-users',
						hidden: !['ROLE_ADMIN'].includes(this.$store.getters['auth/user'].role)
					},
          {
            href: {
              name: 'chat'
            },
            title: 'Chat',
            class: 'menu-icon',
            icon: 'fas fa-comments',
          },{
            href: {
              name: 'courses'
            },
            title: 'I Miei Corsi',
            class: 'menu-icon',
            icon: 'fas fa-user',
            hidden: ['ROLE_ADMIN'].includes(this.$store.getters['auth/user'].role)
          }
				];
			},
		},
		components: {
			SidebarMenu
		},
		methods: {
			collapse() {
				this.collapsed = !this.collapsed
				this.$store.commit('SET_MENU_COLLAPSED', this.collapsed)
			},
		},
	}
</script>

<style scoped>
.sidebar-header {
	display: flex;
	justify-content: space-between;
}

.btn-collapse {
	padding: 0px;
	margin: 1rem;
}

.collapse-menu-icon {
    font-size: 10px;
}

.sidebar-symbol {
	max-width: 47px;
	padding: 10px;
}

.v-sidebar-menu.vsm_white-theme {
	background: #f9f9f9;
	box-shadow: inset -1px 0px 0px 0px #ddd;
    padding-top: 5rem;
}

.btn-toolbar button {
    position: absolute;
    bottom: 10px;
    right: -12px;
    padding: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    background: #fff;
    border-radius: 50%;
    border: 1px solid #ccc;
    margin: 0px;
}
</style>

