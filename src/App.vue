<template>
	<div>
		<div style="height: 400px; width: 800px">
			<mgl-map
				v-if="showMap"
				ref="map"
				style="margin-bottom: 20px"
				:center="center"
				:zoom="zoom"
				:attribution-control="false"
				@map:load="onLoad"
				@map:zoomstart="isZooming = true"
				@map:zoomend="isZooming = false"
			>
				<mgl-frame-rate-control/>
				<mgl-fullscreen-control/>
				<mgl-attribution-control/>
				<mgl-navigation-control/>
				<mgl-scale-control/>
				<mgl-geolocation-control/>
				<mgl-custom-control v-if="showCustomControl" position="top-left" :no-classes="!useClasses">
					<mgl-button type="mdi" :path="buttonIcon" style="color: deepskyblue"/>
				</mgl-custom-control>
				<mgl-style-switch-control :map-styles="mapStyles" :position="controlPosition"/>

				<mgl-marker :coordinates="markerCoordinates" color="#cc0000" :scale="0.5"/>

				<mgl-geo-json-source source-id="geojson" :data="geoJsonSource.data">
					<mgl-line-layer
						v-if="geoJsonSource.show"
						layer-id="geojson"
						:layout="layout"
						:paint="paint"
						@mouseenter="onMouseenter"
					/>
				</mgl-geo-json-source>

			</mgl-map>
		</div>
		Loaded Count: {{ loaded }}<br>
		Is Zooming: {{ isZooming }}<br>
		<div>
			<input type="radio" id="one" value="top-left" v-model="controlPosition"/>
			<label for="one">top-left</label>
			<br/>
			<input type="radio" id="tw0" value="top-right" v-model="controlPosition"/>
			<label for="tw0">top-right</label>
			<br/>
			<input type="radio" id="three" value="bottom-left" v-model="controlPosition"/>
			<label for="three">bottom-left</label>
			<br/>
			<input type="radio" id="four" value="bottom-right" v-model="controlPosition"/>
			<label for="four">bottom-right</label>
			<br/>
			<span>Attribution Position: {{ controlPosition }}</span>
		</div>
		<div>
			<input type="checkbox" v-model="useClasses" id="noclasses">
			<label for="noclasses">Use Custom Control Classes</label>
		</div>
		<div>
			<input type="checkbox" v-model="showCustomControl" id="showcustom">
			<label for="showcustom">Show Custom Control</label>
		</div>
		<div>
			<input type="checkbox" v-model="showMap" id="showmap">
			<label for="showmap">Show Map</label>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, ref, toRef, watch } from 'vue';
	import { MglDefaults, MglEvent, Position, StyleSwitchItem, useMap } from '@/lib/main';
	import { mdiCursorDefaultClick } from '@mdi/js';
	import { LineLayerSpecification, LngLatLike, MapLayerMouseEvent } from 'maplibre-gl';
	import MglMap from '@/lib/components/map.component';
	import MglFrameRateControl from '@/lib/components/controls/frameRate.control';
	import MglFullscreenControl from '@/lib/components/controls/fullscreen.control';
	import MglAttributionControl from '@/lib/components/controls/attribution.control';
	import MglNavigationControl from '@/lib/components/controls/navigation.control';
	import MglScaleControl from '@/lib/components/controls/scale.control';
	import MglGeolocationControl from '@/lib/components/controls/geolocation.control';
	import MglCustomControl from '@/lib/components/controls/custom.control';
	import MglButton from '@/lib/components/button.component';
	import MglStyleSwitchControl from '@/lib/components/controls/styleSwitch.control';
	import MglMarker from '@/lib/components/marker.component';
	import MglGeoJsonSource from '@/lib/components/sources/geojson.source';
	import MglLineLayer from '@/lib/components/layers/line.layer';
	import { FeatureCollection } from 'geojson';

	MglDefaults.style = 'https://api.maptiler.com/maps/streets/style.json?key=cQX2iET1gmOW38bedbUh';
	console.log('MglDefaults', MglDefaults);

	export default defineComponent({
		name      : 'App',
		components: {
			MglLineLayer, MglGeoJsonSource, MglMarker, MglStyleSwitchControl, MglButton, MglCustomControl, MglGeolocationControl, MglScaleControl,
			MglNavigationControl, MglAttributionControl, MglFullscreenControl, MglFrameRateControl, MglMap
		},
		setup() {

			const map               = useMap(),
				  showCustomControl = ref(true),
				  loaded            = ref(0),
				  markerCoordinates = ref<LngLatLike>([ 13.377507, 52.516267 ]),
				  geoJsonSource     = ref({
					  show: true,
					  data: <FeatureCollection>{
						  type    : 'FeatureCollection',
						  features: [
							  {
								  type      : 'Feature',
								  properties: {},
								  geometry  : {
									  type       : 'LineString',
									  coordinates: [
										  [ -122.483696, 37.833818 ],
										  [ -122.483482, 37.833174 ],
										  [ -122.483396, 37.8327 ],
										  [ -122.483568, 37.832056 ],
										  [ -122.48404, 37.831141 ],
										  [ -122.48404, 37.830497 ],
										  [ -122.483482, 37.82992 ],
										  [ -122.483568, 37.829548 ],
										  [ -122.48507, 37.829446 ],
										  [ -122.4861, 37.828802 ],
										  [ -122.486958, 37.82931 ],
										  [ -122.487001, 37.830802 ],
										  [ -122.487516, 37.831683 ],
										  [ -122.488031, 37.832158 ],
										  [ -122.488889, 37.832971 ],
										  [ -122.489876, 37.832632 ],
										  [ -122.490434, 37.832937 ],
										  [ -122.49125, 37.832429 ],
										  [ -122.491636, 37.832564 ],
										  [ -122.492237, 37.833378 ],
										  [ -122.493782, 37.833683 ]
									  ]
								  }
							  }
						  ]
					  }
				  });

			watch(toRef(map, 'isLoaded'), () => (console.log('IS LOADED', map)), { immediate: true });
			watch(toRef(map, 'isMounted'), (v: boolean) => (console.log('IS MOUNTED', v)), { immediate: true });

			onMounted(() => {
				setTimeout(() => (markerCoordinates.value = [ 13.377507, 42.516267 ]), 5000);
				setInterval(() => (geoJsonSource.value.show = !geoJsonSource.value.show), 1000);
			});

			function onLoad(e: MglEvent) {
				loaded.value++;
				console.log(e.type, e);
			}

			function onMouseenter(e: MapLayerMouseEvent) {
				console.log('EVENT', e.type, e.lngLat);
			}


			return {
				showCustomControl, loaded, markerCoordinates, geoJsonSource, onLoad, onMouseenter,
				isZooming      : false,
				controlPosition: ref(Position.TOP_LEFT),
				showMap        : ref(true),
				center         : [ 10.288107, 49.405078 ] as LngLatLike,
				zoom           : 3,
				useClasses     : ref(true),
				mapStyles      : [
					{
						name : 'Streets',
						label: 'Streets',
						// icon : { path: mdiRoad },
						style: 'https://api.maptiler.com/maps/streets/style.json?key=cQX2iET1gmOW38bedbUh'
					},
					{ name: 'Basic', label: 'Basic', style: 'https://api.maptiler.com/maps/basic/style.json?key=cQX2iET1gmOW38bedbUh' },
					{ name: 'Bright', label: 'Bright', style: 'https://api.maptiler.com/maps/bright/style.json?key=cQX2iET1gmOW38bedbUh' },
					{ name: 'Satellite', label: 'Satellite', style: 'https://api.maptiler.com/maps/hybrid/style.json?key=cQX2iET1gmOW38bedbUh' },
					{ name: 'Voyager', label: 'Voyager', style: 'https://api.maptiler.com/maps/voyager/style.json?key=cQX2iET1gmOW38bedbUh' }
				] as StyleSwitchItem[],
				buttonIcon     : mdiCursorDefaultClick,
				layout         : {
					'line-join': 'round',
					'line-cap' : 'round'
				} as LineLayerSpecification['layout'],
				paint          : {
					'line-color': '#FF0000',
					'line-width': 8
				} as LineLayerSpecification['paint']
			};
		}
	});
</script>

<style lang="scss">

	@import "~maplibre-gl/dist/maplibre-gl.css";
	@import "@/lib/css/maplibre.scss";

	body {
		margin: 0;
	}
</style>
