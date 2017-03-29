import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

var pubList={
	pubItems:''
};

const actions={
	send:({
		commit
	})=>{
		commit(sendPub)
	}
}

const mutations={
	sendPub(pubList){
		// pubList.pubItems=
	}
}
const getters={
	pubItems(pubList){
		return pubList.pubItems
	}
}


export default new Vuex.Store({
	pubList,
	mutations,
	actions,
	getters
})