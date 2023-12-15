import axios from 'axios';

export async function createThread(): Promise<string> {
	const apiUrl = 'https://mastrogpt.nuvolaris.app/api/my/waitlist/createThread';

	try {
		const response = await axios.post(apiUrl);
		console.log('Response:', response.data);

		if (response.data && response.data.id) {
			return response.data.id as string;
		} else {
			throw new Error('thread id not present');
		}
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}

export async function sendMessageOnThread(threadId: string, message: string) {
	const apiUrl = 'https://mastrogpt.nuvolaris.app/api/my/waitlist/sendMessage';
	const headers = {
		'Content-Type': 'application/json'
	};

	const requestData = {
		threadId: threadId,
		message: message
	};

	axios
		.post(apiUrl, requestData, { headers })
		.then((response) => {
			console.log('Response:', response.data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

export async function listMessages(threadId: string): Promise<any> {
	const apiUrl = 'https://mastrogpt.nuvolaris.app/api/my/waitlist/listMessages';
	const headers = {
		'Content-Type': 'application/json'
	};

	const requestData = {
		threadId: threadId
	};

	try {
		const response = await axios.post(apiUrl, requestData, { headers });
		return response.data;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}
