const axios = require("axios");

const API_URL = "http://4.224.186.213/evaluation-service/notifications";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwYXdhcmFuc2hpa2ExNTEyQGdtYWlsLmNvbSIsImV4cCI6MTc3OTEwNDQ0OCwiaWF0IjoxNzc5MTAzNTQ4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOTBjZTFiMGYtZjY2Yi00ZTRjLThmMjAtNGIzMzQwNWUxOGRmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYW5zaGlrYSBwYXdhciIsInN1YiI6IjVjYmRmZGQwLTA2NWItNGE2Zi05OWIzLTRmMjdmMmYxNjVlYSJ9LCJlbWFpbCI6InBhd2FyYW5zaGlrYTE1MTJAZ21haWwuY29tIiwibmFtZSI6ImFuc2hpa2EgcGF3YXIiLCJyb2xsTm8iOiJ0aXQ0NCIsImFjY2Vzc0NvZGUiOiJmekVRU1EiLCJjbGllbnRJRCI6IjVjYmRmZGQwLTA2NWItNGE2Zi05OWIzLTRmMjdmMmYxNjVlYSIsImNsaWVudFNlY3JldCI6ImZLSmR6Vkp3S2pxbmtKQ1UifQ.xR1FAef_3xyYPcC1mrrfaaExkF1YhRm314QB3Egts5w";

function calculatePriority(notification) {

    let score = 0;

    if (notification.Type === "Placement") {
        score += 50;
    } else if (notification.Type === "Result") {
        score += 40;
    } else if (notification.Type === "Event") {
        score += 30;
    } else {
        score += 10;
    }

    const notificationTime = new Date(notification.Timestamp).getTime();

    const currentTime = new Date().getTime();

    const hourDifference =
        (currentTime - notificationTime) / (1000 * 60 * 60);

    if (hourDifference <= 24) {
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

        const notifications = response.data.notifications || [];

        notifications.forEach(notification => {
            notification.priorityScore =
                calculatePriority(notification);
        });

        notifications.sort(
            (a, b) => b.priorityScore - a.priorityScore
        );

        const topNotifications = notifications.slice(0, 10);

        console.log("\nTop 10 Priority Notifications:\n");

        topNotifications.forEach((notification, index) => {

            console.log(`${index + 1}. ${notification.Type}`);

            console.log(`Message: ${notification.Message}`);

            console.log(`Priority Score: ${notification.priorityScore}`);

            console.log(`Timestamp: ${notification.Timestamp}`);

            console.log("--------------------------------");
        });

    } catch (error) {

        console.log("Error fetching notifications");

        console.log(error.message);
    }
}

fetchNotifications();