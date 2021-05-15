<template>
        <ul class="flex space-x-2 " :class="$attrs.class">
            <li
                v-for="(tab, i) of tabs"
                :key="i"
                :class="
                    active === i
                        ? 'border-b-4 border-primary-500 box-content text-gray-800 '+ activeClass
                        : 'border-b-4 border-transparent text-gray-500'
                "
                class="flex items-center px-6 py-3 overflow-hidden cursor-pointer rounded-tl-md rounded-tr-md hover:text-gray-800"
                @click="selectTab(i)"
            >
                <div v-html="tab.props.title"></div>
            </li>
        </ul>
        <div class="h-1 -mt-1 bg-gray-300"></div>
        <div class="">
            <slot />
        </div>
</template>

<script>
import { provide, computed, ref } from "vue";

export default {
    name: "Tabs",
    props: {
        modelValue: {
            type: [String, Number],
        },
        activeClass: {
            type: String,
            default: 'tab-active'
        }
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const active = computed(() => props.modelValue);
        const tabs = ref([]);

        function selectTab(tab) {
            emit("update:modelValue", tab);
        }

        provide("tabsState", {
            active,
            tabs,
        });

        return {
            tabs,
            active,
            selectTab,
        };
    },
};
</script>

