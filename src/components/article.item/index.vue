<template>
    <van-cell
        class="article-item"
        :to="{
            name: 'article',
            params: { articleId: article.art_id }
        }"
    >
        <div slot="title" class="title van-multi-ellipsis--l3">
            {{ article.title }}
        </div>
        <div slot="label">
            <div class="cover-wrap" v-if="article.cover.type === 3">
                <van-image
                    width="116"
                    height="73"
                    fit="cover"
                    v-for="(img, index) in article.cover.images"
                    :key="index"
                    :src="img"
                />
            </div>
            <div class="label-wrap">
                <span>{{ article.aut_name }}</span>
                <span>{{ article.comm_count }}评论</span>
                <span>{{ article.pubdate | dateTo }}</span>
            </div>
        </div>
        <van-image
            v-if="article.cover.type === 1"
            class="right-cover"
            fit="cover"
            :src="article.cover.images[0]"
            referrerPolicy="no-referrer"
        >
        </van-image>
    </van-cell>
</template>

<script>
    export default {
        name: '',
        components: {},
        props: {
            article: {
                type: Object,
                required: true
            }
        },
        data() {
            return {};
        },
        computed: {},
        watch: {},
        methods: {},
        created() {},
        mounted() {}
    };
</script>

<style lang="less" scoped>
    .article-item {
        .title {
            font-size: 16px;
            color: #3a3a3a;
        }
        /deep/ .van-cell__value {
            flex: unset;
            width: 116px;
            height: 93px;
            margin-left: 12px;
        }
        .right-cover {
            width: 116px;
            height: 73px;
        }
        .cover-wrap {
            padding: 15px 0;
            display: flex;
            flex-wrap: nowrap;
            .van-image {
                flex: 1;
                &:not(:last-child) {
                    padding-right: 4px;
                }
            }
        }
        .label-wrap {
            font-size: 11px;
            color: #b4b4b4;
            span {
                margin-right: 12px;
            }
        }
    }
</style>
