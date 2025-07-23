<template>
    <div class="MessageNotificationBackground">
        <div class="MessageNotification">
            <div>
                <NotificationContainer />
            </div>
        </div>
    </div>
</template>
<script setup>
import NotificationContainer from '@/components/DisplayBox/NotificationContainer.vue'

</script>
<style scoped>
.MessageNotificationBackground {
    height: 100vh;
    display: flex;
    justify-content: center;
}

.MessageNotification {
    border-bottom: 1px solid #ddd;
    width: 100%;
    height: 100%;
    margin-top: 30px;
    gap: 10px;
    margin-bottom: 100px;
}

@media (max-width: 768px) {
    .MessageNotification {
        margin-left: 0;
    }
}
</style>