<template>
    <div>
        <BaseNav />
        <div class="main-content" :style="marginCollapsed">
            <Menu :sidebarWidth="sidebarWidth" />
            <b-container fluid>
                <div class="pagename">
                    <font-awesome-icon v-if="pageIcon" :icon="pageIcon" class="icon"></font-awesome-icon>
                    <span class="page-name">{{pageName}}</span>
                </div>
                <router-view></router-view>
            </b-container>
        </div>
    </div>
</template>

<script>
    import Menu from '@/components/Menu.vue'
    import BaseNav from '@/components/NavBar/BaseNav.vue'
    import { mapGetters, mapState } from 'vuex'

    export default {
        name: "LeftSide",
        components: {
            Menu,
            BaseNav
        },
        computed: {
            ...mapGetters(['pageName', 'pageIcon', 'marginCollapsed']),
            ...mapState(['sidebarWidth'])
        },
    }
</script>

<style scoped>
    .main-content {
        box-shadow: inset 0px 1px 1px 0px #eee;
        height: 100%;
        margin-left: 200px;
        padding: 2rem 1rem;
    }

    .pagename {
		display: flex;
		align-content: center;
		line-height: 1;
		font-size: 18px;
        font-weight: bold;
        padding-bottom: 1rem;
        margin-bottom: 2rem;
	}

	.pagename .icon {
		color: var(--main);
		margin-right: 5px;
	}
</style>