<template>
  <view class="container">
    <map id="map" :latitude="latitude" :longitude="longitude" @regionchange="regionChange" show-location :markers="markers" class="map"></map>
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
			markers.value = res.data.map((park: { id: any; latitude: any; longitude: any; allowsPets: any; }) => ({
        id: park.id,
        latitude: park.latitude,
        longitude: park.longitude,
        iconPath: park.allowsPets ? '/static/abyssinian.svg' : '/static/no-pet.svg',
        width: 30,
        height: 30
      }));
		}
	}

const regionChange = (e: { type: string; }) => {
  if (e.type === 'end') {
    getQueryList()
  }
}


onMounted(() => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      latitude.value = res.latitude;
      longitude.value = res.longitude;
      // 添加用户当前位置的标记
      markers.value.push({
        id: 'currentLocation',
        latitude: res.latitude,
        longitude: res.longitude,
        iconPath: '/static/positioning.svg',
        width: 30,
        height: 30
      });
      getQueryList();
    }
  });
})
</script>

<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map {
  width: 100%;
  height: 100%;
}
</style>

