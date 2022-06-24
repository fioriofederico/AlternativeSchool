<template>
	<b-navbar type="light">
		<b-collapse id="nav-collapse" is-nav>
			<b-navbar-brand href="/">
				<b-img src="@/assets/symbol.png" fluid width="30"></b-img>
			</b-navbar-brand>
			<!-- Right aligned nav items -->
			<b-navbar-nav class="ml-auto">
				<div class="nav-bottom-wrap">
					<b-button
						v-b-tooltip.hover.top="'Logout'"
						@click="$store.dispatch('auth/logout', $store.state.auth.user)"
						variant="link"
					>
						<font-awesome-icon icon="sign-out-alt" class="text-dark"></font-awesome-icon>
					</b-button>
				</div>
			</b-navbar-nav>
		</b-collapse>
	</b-navbar>
</template>

<script>
	export default {
		name: "BaseNav",
	}
</script>

<style scoped>
	.navbar {
		background: #fff;
		border-bottom: 1px solid #ccc;
		box-shadow: 0px 0px 2px 1px #ddd;
		height: 54px;
		z-index: 1000;
	}

	.nav-bottom-wrap button:last-child {
		padding-right: 0px;
	}

	.navigation-link {
		background: var(--grey);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: row wrap;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		transition: all .2s linear;
	}

	.navigation-link:hover {
		opacity: .8;
	}

	.navigation-link:nth-child(even) {
		margin-left: 10px
	}
</style>
