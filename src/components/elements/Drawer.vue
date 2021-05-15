<template>
	<section>
		<aside class="sidebar" :class="classes" :style="style" ref="element">
			<slot name="header">
				<div class="flex flex-wrap items-center justify-between px-4 py-3 text-lg font-medium border-b">
					<div class="">{{ title }}</div>
					<button @click="closeDrawer" class="flex items-center justify-center w-5 h-5 text-gray-600 hover:text-red-500">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</slot>
			<slot></slot>
		</aside>
		<div class="overlay" @click="closeDrawer" @transitionend="handleZindex" ref="overlay"></div>
	</section>
</template>
<script setup>
import { computed, defineEmit, defineProps, onMounted, ref, toRef, watch } from "vue"

const props = defineProps({
	open: {
		type: Boolean,
		required: true
	},
	direction: {
		type: String,
		default: 'end'
	},
	width: {
		type: String,
		default: '300px'
	},
	swipe: {
		type: Boolean,
		default: false
	},
	title: String,
	classes: String,
})

const emit = defineEmit(['close'])

const open = toRef(props, 'open')
const element = ref('')
const overlay = ref('')
const visible = ref('')
const translate = ref(null)
const auto_speed = '0.3s'
const manual_speed = '0.01s'
const threshold = ref(20)
const startTime = ref(null)
const startPos = ref(null)

const style = computed(() => {
	if(isDirection('right')){
		return 'transform: translate3d(100%, 0, 0); right:0;width:' + props.width;
	}else{
		return 'transform: translate3d(-100%, 0, 0); left:0;width:' + props.width;
	}
})

onMounted(() => {
	if(props.swipe){
		document.addEventListener('touchstart', handleStart);
		document.addEventListener('touchmove', handleMove);
		document.addEventListener('touchend', handleEnd);
		document.addEventListener('touchcancel', handleEnd);
		window.addEventListener('resize', setVisibality, true);
		setVisibality()
	}
})

watch(() => props.open, (val) => {
	// console.log('open', val)
	if(val) {
		openDrawer()
	}
})


const isDir = (dir) => dir == (document.documentElement.getAttribute('dir') || 'ltr')
const isDirection = (direction) => {
	if(direction == 'left'){
		return props.direction == 'start' && isDir('ltr') ||  props.direction == 'end' && isDir('rtl')
	}
	return props.direction == 'start' && isDir('rtl') ||  props.direction == 'end' && isDir('ltr')
}

const openDrawer = () => {
	// console.log('open')
	translate.value = 0;
	element.value.style.transform = `translate3d(${translate.value}, 0, 0)`;
	element.value.style.transitionDuration = auto_speed;
	overlayOpacity(1);
	lock(document.querySelector('html'));
	lock(document.querySelector('body'));
	element.value.classList.add('active');	
}

const closeDrawer = () => {
	// console.log('close')
	emit('close')
	const dir = document.documentElement.getAttribute('dir') || 'ltr'
	if(props.direction == 'start' && dir == 'ltr' ||  props.direction == 'end' && dir == 'rtl'){
		translate.value = '-'+element.value.offsetWidth + 'px';
	}else{
		translate.value = element.value.offsetWidth + 'px';
	}
	element.value.style.transform = 'translate3d(' + translate.value + ', 0, 0)';	
	element.value.style.transitionDuration = auto_speed;	
	overlayOpacity(0);
	unlock(document.querySelector('html'));
	unlock(document.querySelector('body'));
	element.value.classList.remove('active');	
}

const handleStart = (e) => {
	startTime.value = new Date().getTime();
	startPos.value = e.targetTouches[0].pageX;
	element.value.style.transitionDuration = manual_speed;
}

const handleMove = (e) => {
	let _gesture = gesture(e);
	let valid = validate(_gesture);
	if(valid) {
		let percent = percentage(_gesture);
		if(isDirection('left')) {
			translate.value = (e.touches[0].pageX - element.value.offsetWidth);
			if(translate.value < 0) {
				element.value.style.transform = `translate3d(${translate.value}px, 0, 0)`;
			}else{
				openDrawer();						
			}
		}else{
			translate.value = -(screen.width - element.value.offsetWidth - e.touches[0].pageX);
			if(translate.value > 0) {
				element.value.style.transform = `translate3d(${translate.value}px, 0, 0)`;
			}else{
				openDrawer();						
			}
		}
		overlayOpacity(percent/100);
	}
}

const handleEnd = (e) => {
	const _speed = speed(e);
	const _gesture = gesture(e);
	const valid = validate(_gesture);
	
	if(valid){
		if(_speed > 0.6){
			if(!open.value){
				openDrawer();									
			}else{
				closeDrawer();						
			}
		}else{
			if(element.value.offsetWidth / 2 > Math.abs(translate.value)){
				openDrawer();						
			}else{
				closeDrawer();						
			}
		}			
	}
}

const validate = (gesture) => {
	if(isDirection('left')){
		if((open.value && gesture == 'swiperight') || (!open.value && (gesture == 'swipeleft' || startPos.value > threshold.value))){
			return false;
		}
	}else{
		if((open.value && gesture == 'swipeleft') || (!open.value && (gesture == 'swiperight' || startPos.value < (screen.width - threshold.value)))){
			return false;
		}
	}
	if((element.value.classList.contains('active') && !open.value) || !visible.value){
		return false;
	}
	return true;
}
const gesture = (e) => {
	let currentPos = e.changedTouches[0].pageX;
	if((startPos.value  - currentPos) < 0){
		return 'swiperight';
	}else{
		return 'swipeleft';
	}
}

const speed  = (e) => {
	let time = new Date().getTime() - startTime.value;
	let startP = Math.abs(startPos.value);
	let endP =  Math.abs(e.changedTouches[0].pageX);
	let distance = startP>endP? (startP-endP):(endP-startP);
	return distance/time;
}

const percentage = (gesture) => {
	let _percentage = 0;
	let test = [];
	if(isDirection('left')){
		test = ['swipeleft','swiperight']
	}else{
		test = ['swiperight','swipeleft']			
	}
	if(open.value && gesture == test[0]){
		_percentage = 100 - Math.round(Math.abs(translate.value) / element.value.offsetWidth * 100);
	}
	if(!open.value && gesture == test[1]){
		_percentage = Math.round(100 - Math.abs(translate.value) / element.value.offsetWidth * 100);
	}
	if(_percentage > 100){
		_percentage = 100;
	}
	if(_percentage < 0){
		_percentage = 0;
	}
	return _percentage;
}

const handleZindex = (e) => {
	const opacity = window.getComputedStyle(overlay.value).getPropertyValue('opacity');
	if(opacity <= 0 && overlay.value){
		overlay.value.style.zIndex = -999;			
	}
}

const setVisibality = () => {
	visible.value = element.value.offsetWidth != 0;
}

const overlayOpacity = (opacity) => {
	overlay.value.style.opacity = opacity;
	if(opacity > 0){
		overlay.value.style.zIndex = 999;					
	}
}

const lock = (element) => {
	element.style.overflow = 'hidden';
	element.style.touchAction = 'none';
}

const unlock = (element) => {
	element.style.removeProperty('overflow');
	element.style.removeProperty('touch-action');
}

</script>
<style scoped>
	div.overlay{
	    position:fixed;
	    z-index: -999;
	    left: 0px;
	    top:0px;
	    background:rgba(11, 10, 12, 0.35);
	    opacity: 0;
	    width: 100%;
	    height: 100%;
	    transition: opacity 0.3s ease;
	}
	aside.sidebar{
	    z-index: 9999;
	    position: fixed;
	    will-change: transform;
	    height: 100%;
	    top: 0px;
		max-width: 100%;
		transition:transform 0.3s ease;
	    background:#fff;
		overflow-y: auto;
		overflow-x: hidden;
		word-wrap: break-word;
	}
</style>