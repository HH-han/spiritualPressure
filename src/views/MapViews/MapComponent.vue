<template>
  <div ref="mapRef" class="map"></div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
AMapLoader.reset();

export default {
  props: {
    center: {
      type: Object,
      default: () => ({ lat: 39.9042, lng: 116.4074 })
    },
    zoom: {
      type: Number,
      default: 12
    }
  },
  emits: ['marker-clicked'],
  setup(props, { emit }) {
    const mapRef = ref(null);
    let map = null;
    let markers = [];
    let driving = null;

    const loadMap = async () => {
      try {
        const AMap = await AMapLoader.load({
          key: "db60e30ce92c69d34e324037b8f79ba7",

          version: "2.0",
          plugins: ['AMap.Marker', 'AMap.Driving', 'AMap.MapType', 'AMap.Geolocation']
        });

        map = new AMap.Map(mapRef.value, {
          center: [props.center.lng, props.center.lat],
          zoom: props.zoom
        });

        // 添加图层切换控件
        const mapType = new AMap.MapType();
        map.addControl(mapType);

        map.on('click', (e) => {
          console.log('地图点击:', e.lnglat);
        });

        // 获取当前位置
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
          convert: true,
          showButton: true,
          buttonPosition: 'RB',
          buttonOffset: new AMap.Pixel(10, 20),
          showMarker: true,
          showCircle: true,
          panToLocation: true,
          zoomToAccuracy: true
        });

        map.addControl(geolocation);

        geolocation.getCurrentPosition((status, result) => {
          if (status === 'complete') {
            console.log('定位成功', result);
            // 可以在这里根据定位结果更新地图中心点或添加标记
            map.setCenter([result.position.lng, result.position.lat]);
          } else {
            console.error('定位失败', result);
          }
        });

        return AMap;
      } catch (error) {
        console.error('加载地图失败:', error);
      }
    };

    const addMarker = (position) => {
      const marker = new window.AMap.Marker({
        position: [position.lng, position.lat]
      });

      marker.setMap(map);
      markers.push(marker);

      marker.on('click', (e) => {
        emit('marker-clicked', {
          lng: e.lnglat.lng,
          lat: e.lnglat.lat
        });
      });
    };

    const removeLastMarker = () => {
      if (markers.length > 0) {
        const lastMarker = markers.pop();
        lastMarker.setMap(null);
      }
    };

    const removeMarker = (index) => {
      if (index >= 0 && index < markers.length) {
        const marker = markers[index];
        marker.setMap(null);
        markers.splice(index, 1);
      }
    };

    const resetMap = () => {
      map.setCenter([props.center.lng, props.center.lat]);
      map.setZoom(props.zoom);
      markers.forEach(marker => marker.setMap(null));
      markers = [];
      if (driving) {
        driving.clear();
      }
    };

    const planRoute = (start, end) => {
      if (!driving) {
        driving = new window.AMap.Driving({
          map: map,
          panel: "route-panel"
        });
      }
      driving.search([start.lng, start.lat], [end.lng, end.lat]);
    };

    const clearDirections = () => {
      if (driving) {
        driving.clear();
      }
    };

    const drawRoute = (start, end) => {
      if (!driving) {
        driving = new window.AMap.Driving({
          map: map,
          panel: "route-panel"
        });
      }
      driving.search([start.lng, start.lat], [end.lng, end.lat]);
    };

    const destroyMap = () => {
      if (map) {
        map.destroy();
        map = null;
      }
    };

    onMounted(async () => {
      await loadMap();
    });

    onUnmounted(() => {
      destroyMap();
    });

    return {
      mapRef,
      addMarker,
      removeLastMarker,
      removeMarker,
      resetMap,
      planRoute,
      clearDirections,
      drawRoute
    };
  }
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>