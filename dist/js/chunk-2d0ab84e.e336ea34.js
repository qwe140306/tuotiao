(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0ab84e"],{"162e":function(t,a,e){"use strict";e.r(a);var o=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"layout-container"},[e("keep-alive",[e("router-view")],1),e("van-tabbar",{attrs:{route:""},model:{value:t.active,callback:function(a){t.active=a},expression:"active"}},[e("van-tabbar-item",{attrs:{icon:"home-o",to:"/"}},[t._v(" 首页 ")]),e("van-tabbar-item",{attrs:{icon:"comment-o",to:"/qa"}},[t._v(" 问答 ")]),e("van-tabbar-item",{attrs:{icon:"video-o",to:"/video"}},[t._v(" 视频 ")]),t.$store.state.user?e("van-tabbar-item",{attrs:{icon:"manager-o",to:"/my"}},[t._v(" 我的 ")]):e("van-tabbar-item",{attrs:{icon:"manager-o",to:"/my"}},[t._v(" 未登录 ")])],1)],1)},n=[],c={name:"Layout",components:{},props:{},data:function(){return{active:0}},computed:{},watch:{},methods:{},created:function(){},mounted:function(){this.$store.commit("addCachePages","Layout")}},i=c,r=e("2877"),s=Object(r["a"])(i,o,n,!1,null,"bc973668",null);a["default"]=s.exports}}]);
//# sourceMappingURL=chunk-2d0ab84e.e336ea34.js.map