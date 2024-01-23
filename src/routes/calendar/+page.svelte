<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { PUBLIC_URL_GET_CALENDAR_TOKEN } from '$env/static/public';
	import { PUBLIC_URL_CALENDAR_ID } from '$env/static/public';

	var token = '';

	const authorizationUrl = generateAuthorizationUrl();
	console.log('Authorization URL:', authorizationUrl);
	async function callback() {
		const queryParams = new URLSearchParams(window.location.search);
		const code = queryParams.get('code');

		if (code) {
			token = getToken(code) as unknown as string;
			console.log('token');
			console.log(token);
		} else {
			console.error('Error: code not exist');
		}
	}

	function generateAuthorizationUrl() {
		const clientId = PUBLIC_URL_CALENDAR_ID;
		const redirectUri = 'http://127.0.0.1:5173/calendar';
		const scope = 'https://www.googleapis.com/auth/calendar';
		const responseType = 'code';

		const authorizationUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
			redirectUri
		)}&scope=${encodeURIComponent(scope)}&response_type=${responseType}`;

		return authorizationUrl;
	}

	async function getToken(code: string) {
		const apiUrl = PUBLIC_URL_GET_CALENDAR_TOKEN;

		const params = {
			code: code
		};

		axios
			.post(apiUrl, params)
			.then((response) => {
				console.log('Response is:', response.data);
				return response.data;
			})
			.catch((error) => {
				console.error('Error during token call:', error);
				throw error;
			});

		return 'error';
	}

	async function getEvents(token: string) {}

	onMount(async () => {
		const queryParams = new URLSearchParams(window.location.search);
		const code = queryParams.get('code');

		if (code) {
			callback();
		} else if (token.length > 0) {
			getEvents(token);
		}
	});
</script>

<p>Ciao</p>
