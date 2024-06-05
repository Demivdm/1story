<template>
    <div class="tag">
        <div class="tag__tag-blocks">
            <div class="tag__tag-block"></div>
            
       
            <!-- Add more .tag__tag-block elements as needed -->
        </div>
    </div>
</template>

<style scoped lang="scss">
$component: "tag";
@import '/scss/vars/colors';

.#{$component} {
    &__tag-blocks {
        display: flex;
    }

    @for $i from 1 through length($colors) {
        &__tag-block:nth-child(#{$i}) {
            background-color: nth($colors, $i);
        }
    }

    &__tag-block {
        height: 16px;
        width: 16px;
        margin-right: 5px;
    }
}
</style>
