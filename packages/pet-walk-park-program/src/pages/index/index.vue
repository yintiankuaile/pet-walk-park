<template>
  <view class="container">
    <map id="map" :latitude="latitude" :longitude="longitude" @regionchange="regionChange" :markers="markers"></map>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';


const latitude = ref(0);
const longitude = ref(0);
const markers = ref([]);


const fetchParks = async () => {
  const response = await axios.get('http://<backend-ip>/parks')
  markers.value = response.data.map((park) => ({
    id: park.id,
    latitude: park.latitude,
    longitude: park.longitude,
    iconPath: park.allowPets ? '/static/cat.png' : '/static/park.png',
    width: 30,
    height: 30
  }))
}

const regionChange = (e) => {
  if (e.type === 'end') {
    fetchParks()
  }
}


onMounted(() => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      latitude.value = res.latitude
      longitude.value = res.longitude
      fetchParks()
    }
  })
})
</script>

<style scoped>
.container {
  height: 100%;
}
</style>
