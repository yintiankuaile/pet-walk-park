<template>
  <view class="container">
    <map id="map" :latitude="latitude" :longitude="longitude" @regionchange="regionChange" :markers="markers"></map>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import mainService from '@/service/mainService';

const latitude = ref(0);
const longitude = ref(0);
const markers = ref([]);

const getQueryList = async () => {
		const [err, res] = await mainService.queryList();
		if (!err && res?.data) {
			markers.value = res.data.map((park) => ({
        id: park.id,
        latitude: park.latitude,
        longitude: park.longitude,
        iconPath: park.allowsPets ? '/static/cat.png' : '/static/park.png',
        width: 30,
        height: 30
      }))
		}
	}

const regionChange = (e) => {
  if (e.type === 'end') {
    getQueryList()
  }
}


onMounted(() => {
  getQueryList()
  // uni.getLocation({
  //   type: 'gcj02',
  //   success: (res) => {
  //     console.log(res, 'res');
      
  //     latitude.value = res.latitude
  //     longitude.value = res.longitude
  //     getQueryList()
  //   }
  // })
})
</script>

<style scoped>
.container {
  height: 100%;
}
</style>
