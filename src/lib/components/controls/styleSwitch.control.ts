import { createCommentVNode, createTextVNode, defineComponent, h, inject, onBeforeUnmount, PropType, ref, shallowRef, Teleport, toRef, watch } from 'vue';
import { Position, PositionProp, PositionValues } from '@/lib/components/controls/position.enum';
import { emitterSymbol, isLoadedSymbol, mapSymbol, StyleSwitchItem } from '@/lib/types';
import { CustomControl } from '@/lib/components/controls/custom.control';
import { usePositionWatcher } from '@/lib/composable/usePositionWatcher';
import { MglButton } from '@/lib/components';
import { ButtonType } from '@/lib/components/button.component';

function isEvent(e: any): e is Event {
	return e && !!(e as Event).stopPropagation;
}

export default /*#__PURE__*/ defineComponent({
	name : 'MglStyleSwitchControl',
	props: {
		position  : {
			type     : String as PropType<PositionProp>,
			validator: (v: Position) => {
				return PositionValues.indexOf(v) !== -1;
			}
		},
		mapStyles : {
			type    : Array as PropType<StyleSwitchItem[]>,
			required: true,
			default : []
		},
		modelValue: {
			type: Object as PropType<StyleSwitchItem>
		},
		isOpen    : {
			type   : Boolean as PropType<boolean>,
			default: undefined
		}
	},
	emits: [ 'update:modelValue', 'update:isOpen' ],
	setup(props, { emit }) {

		const map         = inject(mapSymbol)!,
			  isMapLoaded = inject(isLoadedSymbol)!,
			  emitter     = inject(emitterSymbol)!,
			  isAdded     = ref(false),
			  isOpen      = ref(props.isOpen === undefined ? false : props.isOpen),
			  modelValue  = shallowRef(props.modelValue === undefined ? (props.mapStyles.length ? props.mapStyles[ 0 ] : null) : props.modelValue),
			  control     = new CustomControl(isAdded, false),
			  closer      = toggleOpen.bind(null, false);

		function setStyleByMap() {
			const name = map.value.getStyle().name;
			for (let i = 0, len = props.mapStyles.length; i < len; i++) {
				if (props.mapStyles[ i ].name === name) {
					setStyle(props.mapStyles[ i ]);
					break;
				}
			}
		}

		watch(isMapLoaded, (v) => {
			if (v) setStyleByMap();
		}, { immediate: true });
		map.value.on('style.load', setStyleByMap);
		document.addEventListener('click', closer);


		usePositionWatcher(toRef(props, 'position'), map, control);

		if (props.modelValue !== undefined) {
			watch(toRef(props, 'modelValue'), v => {
				if (v !== undefined) modelValue.value = v;
			});
		}
		if (props.isOpen !== undefined) {
			watch(toRef(props, 'isOpen'), v => {
				if (v !== undefined) isOpen.value = v;
			});
		}

		onBeforeUnmount(() => {
			map.value.removeControl(control);
			map.value.off('style.load', setStyleByMap);
			document.removeEventListener('click', closer);
		});

		function setStyle(s: StyleSwitchItem) {
			if (modelValue.value?.name === s.name) {
				return;
			}
			emitter.emit('styleSwitched', s);
			map.value.setStyle(s.style);
			if (props.modelValue === undefined) {
				modelValue.value = s;
			}
			emit('update:modelValue', s);

			toggleOpen(false);
		}

		function toggleOpen(forceIsOpen?: boolean | Event, e?: Event) {
			if (isEvent(e)) {
				e.stopPropagation();
			} else if (isEvent(forceIsOpen)) {
				forceIsOpen.stopPropagation();
			}
			if (props.isOpen !== undefined && props.isOpen === forceIsOpen || isOpen.value === forceIsOpen) {
				return;
			}
			if (props.isOpen === undefined) {
				isOpen.value = typeof forceIsOpen === 'boolean' ? forceIsOpen : !isOpen.value;
				emit('update:isOpen', isOpen.value);
			} else {
				emit('update:isOpen', typeof forceIsOpen === 'boolean' ? forceIsOpen : !props.isOpen);
			}
		}

		return { isAdded, container: control.container, setStyle, toggleOpen, intIsOpen: isOpen, intModelValue: modelValue };

	},
	// just only for code assist
	template: `
		<slot>
		<slot name="button"></slot>
		<slot name="styleList"></slot>
		</slot>
	`,
	render() {
		if (!this.isAdded) {
			return createCommentVNode('style-switch-control');
		}
		const slotProps = {
			isOpen      : this.intIsOpen,
			currentStyle: this.intModelValue,
			mapStyles   : this.mapStyles,
			toggleOpen  : this.toggleOpen,
			setStyle    : this.setStyle
		};

		return h(
			Teleport as any,
			{ to: this.container },
			this.$slots.default
				? this.$slots.default(slotProps)
				: [
					this.$slots.button
						? this.$slots.button(slotProps)
						: h(MglButton, {
							type   : ButtonType.MDI,
							path   : 'M12,18.54L19.37,12.8L21,14.07L12,21.07L3,14.07L4.62,12.81L12,18.54M12,16L3,9L12,2L21,9L12,16M12,4.53L6.26,9L12,13.47L17.74,9L12,4.53Z',
							'class': [ 'maplibregl-ctrl-icon maplibregl-style-switch', this.intIsOpen ? 'is-open' : '' ],
							onClick: this.toggleOpen.bind(null, true)
						}),
					this.$slots.styleList
						? this.$slots.styleList(slotProps)
						: h(
							'div',
							{ 'class': [ 'maplibregl-style-list', this.intIsOpen ? 'is-open' : '' ] },
							this.mapStyles.map((s) => {
								return s.icon
									? h(MglButton, {
										type   : ButtonType.MDI,
										path   : s.icon.path,
										'class': this.intModelValue?.name === s.name ? 'is-active' : '',
										onClick: () => this.setStyle(s)
									}, createTextVNode(s.label))
									: h('button', {
										type   : 'button',
										'class': this.intModelValue?.name === s.name ? 'is-active' : '',
										onClick: () => this.setStyle(s)
									}, createTextVNode(s.label));

							})
						)
				]
			// renderSlot(this.$slots, 'default', slotProps, () => [
			// 	renderSlot(this.$slots, 'button', slotProps, () => [ h(MglButton, {
			// 		type   : ButtonType.MDI,
			// 		path   : 'M12,18.54L19.37,12.8L21,14.07L12,21.07L3,14.07L4.62,12.81L12,18.54M12,16L3,9L12,2L21,9L12,16M12,4.53L6.26,9L12,13.47L17.74,9L12,4.53Z',
			// 		'class': [ 'maplibregl-ctrl-icon maplibregl-style-switch', this.intIsOpen ? 'is-open' : '' ],
			// 		onClick: this.toggleOpen.bind(null, true)
			// 	}) ]),
			// 	renderSlot(this.$slots, 'styleList', slotProps, () => [
			// 		h(
			// 			'div',
			// 			{ 'class': [ 'maplibregl-style-list', this.intIsOpen ? 'is-open' : '' ] },
			// 			this.mapStyles.map((s) => {
			// 				return s.icon
			// 					? h(MglButton, {
			// 						type   : ButtonType.MDI,
			// 						path   : s.icon.path,
			// 						'class': this.intModelValue?.name === s.name ? 'is-active' : '',
			// 						onClick: () => this.setStyle(s)
			// 					}, createTextVNode(s.label))
			// 					: h('button', {
			// 						type   : 'button',
			// 						'class': this.intModelValue?.name === s.name ? 'is-active' : '',
			// 						onClick: () => this.setStyle(s)
			// 					}, createTextVNode(s.label));
			//
			// 			})
			// 		)
			// 	])
			// ])
		);
	}
});

