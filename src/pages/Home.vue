<template>
	
	<div class="p-10 text-4xl font-medium text-center">
		<h1>{{ lang.$t('welcome') }}</h1>
	</div>
</template>

<script setup>
import { useI18n } from '@/plugins/i18n'
const lang = useI18n()
</script>