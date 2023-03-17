import { HillshadeLayer, HillshadeLayout, HillshadePaint } from 'maplibre-gl';
import { createCommentVNode, defineComponent, getCurrentInstance, inject, PropType, warn, watch } from 'vue';
import { componentIdSymbol, isLoadedSymbol, mapSymbol, sourceIdSymbol } from '@/components/types';
import { LayerLib } from '@/lib/layer.lib';
import { SourceLib } from '@/lib/source.lib';
import { useDisposableLayer } from '@/composable/useDisposableLayer';

export default defineComponent({
	name : 'MglHillshadeLayer',
	props: {
		...LayerLib.SHARED.props,
		layout: Object as PropType<HillshadeLayout>,
		paint : Object as PropType<HillshadePaint>
	},
	emits: [ ...LayerLib.SHARED.emits ],
	setup(props) {

		const sourceId = inject(sourceIdSymbol);

		if (!sourceId && !props.source) {
			warn('Hillshade Layer: layer must be used inside source tag or source prop must be set');
			return;
		}

		const ci        = getCurrentInstance()!,
			  map       = inject(mapSymbol)!,
			  isLoaded  = inject(isLoadedSymbol)!,
			  cid       = inject(componentIdSymbol)!,
			  sourceRef = SourceLib.getSourceRef(cid, props.source || sourceId);

		useDisposableLayer(props.layerId!, ci);

		watch([ isLoaded, sourceRef ], ([ il, src ]) => {
			if (il && (src || src === undefined)) {
				map.value.addLayer(LayerLib.genLayerOpts<HillshadeLayer>(props.layerId!, 'hillshade', props, sourceId), props.before || undefined);
				LayerLib.registerLayerEvents(map.value, props.layerId!, ci.vnode);
			}
		}, { immediate: true });

	},
	render() {
		return createCommentVNode('Hillshade Layer');
	}
});
