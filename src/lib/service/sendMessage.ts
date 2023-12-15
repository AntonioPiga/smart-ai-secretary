import axios from 'axios';

export async function sendMessage(userMessage: string) {
	const headers = {
		'Content-Type': 'application/json'
	};
	const data = {
		userMessage: userMessage
	};

	axios
		.post('https://nuvolaris.app/api/v1/web/mastrogpt/mastrogpt-waitlist/slack-nuv', data, { headers })
		.then((response) => {
			console.log(response.status);
		})
		.catch((error) => {
			console.error(error);
		});
}
