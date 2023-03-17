import { BackgroundLayer, BackgroundLayout, BackgroundPaint } from 'maplibre-gl';
import { createCommentVNode, defineComponent, inject, PropType, warn, watch } from 'vue';
import { componentIdSymbol, isLoadedSymbol, mapSymbol, sourceIdSymbol } from '@/components/types';
import { LayerLib } from '@/lib/layer.lib';
import { SourceLib } from '@/lib/source.lib';
import { useDisposableLayer } from '@/composable/useDisposableLayer';

export default defineComponent({
	name : 'MglBackgroundLayer',
	props: {
		...LayerLib.SHARED.props,
		layout: Object as PropType<BackgroundLayout>,
		paint : Object as PropType<BackgroundPaint>
	},
	emits: [ ...LayerLib.SHARED.emits ],
	setup(props) {

		const sourceId = inject(sourceIdSymbol);

		if (!sourceId && !props.source) {
			warn('Background Layer: layer must be used inside source tag or source prop must be set');
			return;
		}

		const map       = inject(mapSymbol)!,
			  isLoaded  = inject(isLoadedSymbol)!,
			  cid       = inject(componentIdSymbol)!,
			  sourceRef = SourceLib.getSourceRef(cid, props.source || sourceId);

		useDisposableLayer(props.layerId!);

		watch([ isLoaded, sourceRef ], ([ il, src ]) => {
			if (il && (src || src === undefined)) {
				map.value.addLayer(LayerLib.genLayerOpts<BackgroundLayer>(props.layerId!, 'background', props, sourceId), props.before || undefined);
			}
		}, { immediate: true });

	},
	render() {
		return createCommentVNode('Background Layer');
	}
});
