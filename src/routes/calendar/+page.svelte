<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { PUBLIC_URL_GET_CALENDAR_TOKEN } from '$env/static/public';
	import { PUBLIC_URL_CALENDAR_ID } from '$env/static/public';
	import { PUBLIC_URL_AI_DESCRIBE_EVENTS } from '$env/static/public';

	var token = '';
	var eventsDescription: object;

	const authorizationUrl = generateAuthorizationUrl();
	console.log('Authorization URL:', authorizationUrl);

	async function callback() {
		const queryParams = new URLSearchParams(window.location.search);
		const code = queryParams.get('code');

		if (code && token.length == 0) {
			try {
				token = await getToken(code);
				console.log('token:', token);
				var events = await getEvents(token);
				var aiDescriptionEvents = await descriptionEvents(events);
				eventsDescription = aiDescriptionEvents;
			} catch (error) {
				console.error('Error during token and events call:', error);
			}
		} else {
			console.error('Error: code does not exist');
		}
	}

	async function descriptionEvents(events: any) {
		const apiUrl = PUBLIC_URL_AI_DESCRIBE_EVENTS;

		const params = {
			input: events
		};

		try {
			const response = await axios.post(apiUrl, params);
			console.log('Response is:', response.data);
			console.log('Response is:', response.data.token);
			return response.data.output;
		} catch (error) {
			console.error('Error during token call:', error);
			throw error;
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

		try {
			const response = await axios.post(apiUrl, params);
			console.log('Response is:', response.data);
			console.log('Response is:', response.data.token);
			return response.data.token;
		} catch (error) {
			console.error('Error during token call:', error);
			throw error;
		}
	}

	async function getEvents(token: string) {
		const apiUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

		const headers = {
			Authorization: 'Bearer ' + token
		};

		const currentDate = new Date();
		currentDate.setHours(0, 0, 0);
		const formattedStartDate = currentDate.toISOString().split('.')[0] + 'Z';

		currentDate.setHours(23, 59, 59);
		const formattedEndDate = currentDate.toISOString().split('.')[0] + 'Z';

		const params = {
			timeMin: formattedStartDate,
			timeMax: formattedEndDate
		};

		try {
			const response = await axios.get(apiUrl, { headers, params });

			const items: Array<{
				start: string;
				end: string;
				organizer: string;
				summary: string;
			}> = response.data.items.map((item: any) => {
				return {
					start: item.start.dateTime,
					end: item.end.dateTime,
					organizer: item.organizer.email,
					summary: item.summary
				};
			});
			return items;
		} catch (error) {
			console.error('Errore durante la chiamata agli eventi:', error);
			throw error;
		}
	}

	onMount(async () => {
		const queryParams = new URLSearchParams(window.location.search);
		const code = queryParams.get('code');

		if (code && token.length == 0) {
			console.log('callback calling');
			await callback();
		}
	});
</script>

<p>Ciao</p>
<div class="h-50 border border-primary rounded bg-slate-200 shadow-md p-2">
	{#if eventsDescription}
		{eventsDescription}
	{:else}
		<div class="flex justify-center items-center h-30 p-10">
			<div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
		</div>
	{/if}
</div>
