import { defineComponent, inject, onBeforeUnmount, PropType, toRef } from 'vue';
import { Position, PositionProp, PositionValues } from '@/lib/components/controls/position.enum';
import { mapSymbol } from '@/lib/types';
import { ScaleControl } from 'maplibre-gl';
import { usePositionWatcher } from '@/lib/composable/usePositionWatcher';

export enum ScaleControlUnit {
	IMPERIAL = 'imperial',
	METRIC   = 'metric',
	NAUTICAL = 'nautical'
}

type UnitValue = ScaleControlUnit | 'imperial' | 'metric' | 'nautical';
const UnitValues = Object.values(ScaleControlUnit);


export default /*#__PURE__*/ defineComponent({
	name : 'MglScaleControl',
	props: {
		position: {
			type     : String as PropType<PositionProp>,
			validator: (v: Position) => {
				return PositionValues.indexOf(v) !== -1;
			}
		},
		maxWidth: { type: Number as PropType<number>, default: 100 },
		unit    : {
			type     : String as PropType<UnitValue>,
			default  : ScaleControlUnit.METRIC,
			validator: (v: ScaleControlUnit) => {
				return UnitValues.indexOf(v) !== -1;
			}
		}
	},
	setup(props) {

		const map     = inject(mapSymbol)!,
			  control = new ScaleControl({ maxWidth: props.maxWidth, unit: props.unit });

		usePositionWatcher(toRef(props, 'position'), map, control);
		onBeforeUnmount(() => map.value.removeControl(control));

	},
	render() {
		// nothing
	}
});
