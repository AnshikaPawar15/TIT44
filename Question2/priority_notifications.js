const axios = require("axios");

const API_URL = "http://4.224.186.213/evaluation-service/notifications";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwYXdhcmFuc2hpa2ExNTEyQGdtYWlsLmNvbSIsImV4cCI6MTc3OTEwMzUxNiwiaWF0IjoxNzc5MTAyNjE2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNjNjNTQ5YjEtZmUyNy00NDEyLTljM2EtNDJkMWRhODIzOTE2IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYW5zaGlrYSBwYXdhciIsInN1YiI6IjVjYmRmZGQwLTA2NWItNGE2Zi05OWIzLTRmMjdmMmYxNjVlYSJ9LCJlbWFpbCI6InBhd2FyYW5zaGlrYTE1MTJAZ21haWwuY29tIiwibmFtZSI6ImFuc2hpa2EgcGF3YXIiLCJyb2xsTm8iOiJ0aXQ0NCIsImFjY2Vzc0NvZGUiOiJmekVRU1EiLCJjbGllbnRJRCI6IjVjYmRmZGQwLTA2NWItNGE2Zi05OWIzLTRmMjdmMmYxNjVlYSIsImNsaWVudFNlY3JldCI6ImZLSmR6Vkp3S2pxbmtKQ1UifQ.kII7g-zDFchnOKH6zqNwehC-6OlV7gAxD4SR1R85X8s";

function calculatePriority(notification) {

    let score = 0;

    // Weight based on notification type
    if (notification.type === "Placement") {
        score += 50;
    } else if (notification.type === "Result") {
        score += 40;
    } else if (notification.type === "Event") {
        score += 30;
    } else {
        score += 10;
    }

    // Unread notifications get extra priority
    if (!notification.isRead) {
        score += 20;
    }

    // Recent notifications get higher priority
    const createdTime = new Date(notification.createdAt).getTime();
    const currentTime = new Date().getTime();

    const hoursDifference = (currentTime - createdTime) / (1000 * 60 * 60);

    if (hoursDifference <= 24) {
        score += 20;
    }

    return score;
}

async function fetchNotifications() {

    try {

        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });

       const notifications = response.data.notifications;

        // Only unread notifications
        const unreadNotifications = notifications.filter(
            notification => notification.isRead === false
        );

        // Calculate priority score
        unreadNotifications.forEach(notification => {
            notification.priorityScore = calculatePriority(notification);
        });

        // Sort by priority
        unreadNotifications.sort(
            (a, b) => b.priorityScore - a.priorityScore
        );

        // Get top 10
        const topNotifications = unreadNotifications.slice(0, 10);

       if (topNotifications.length === 0) {
       console.log("No unread notifications found");
       return;
}
        console.log("\nTop 10 Priority Notifications:\n");

        topNotifications.forEach((notification, index) => {

            console.log(`${index + 1}. ${notification.title}`);

            console.log(`Type: ${notification.type}`);

            console.log(`Priority Score: ${notification.priorityScore}`);

            console.log(`Message: ${notification.message}`);

            console.log("-----------------------------------");
        });

    } catch (error) {

        console.log("Error fetching notifications");

        console.log(error.message);
    }
}

fetchNotifications();