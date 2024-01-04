import axios from 'axios';

export async function sendMessage(userMessage: string) {
	const headers = {
		'Content-Type': 'application/json'
	};
	const data = {
		text: userMessage
	};

	axios
		.post('https://nuvolaris.dev/api/v1/web/mastrogpt/slack/slack', data, { headers })
		.then((response) => {
			console.log(response.status);
		})
		.catch((error) => {
			console.error(error);
		});
}
