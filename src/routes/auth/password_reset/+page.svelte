<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import config from '$lib/config/settings';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	let debounceTimeout: number;
	let resetting_password: boolean = false;
	let error_string: string = '';
	const ResetToken = $page.url.searchParams.get('reset_token') || false;
	let error_message: HTMLDivElement;
	let error_graphic: HTMLDivElement;

	async function Reset(payload: any) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			error_message.innerText = '';
			error_graphic.classList.add('hidden');
			error_graphic.classList.remove('absolute');
			const r = (await fetchWebApi(
				'v1/auth/passwordreset',
				ResetToken ? 'PATCH' : 'POST',
				what_is(what.public.auth, payload[0]),
				undefined,
				(ResetToken as string) ?? 'NO_TOKEN'
			)) as Response;
			if (!r.ok) {
				setTimeout(() => {
					resetting_password = false; // Slight "bounce"
				}, 450);
				try {
					const res = await r.json();
					error_message.innerText = res.message;
					error_graphic.classList.remove('hidden');
					error_graphic.classList.add('absolute');
					return; /*toast.push(res.message, {
						dismissable: false,
						theme: {
							'--toastBarBackground': 'rgb(var(--COLORRED))'
						}
					});*/
				} catch {
					error_message.innerText = 'Try that again one more time.';
					error_graphic.classList.remove('hidden');
					error_graphic.classList.add('absolute');
					return; /*toast.push(
						'Oops. Something hitched over on our side while requesting a password reset.<br/>Try that again one more time.',
						{
							dismissable: false,
							theme: {
								'--toastBarBackground': 'rgb(var(--COLORRED))'
							}
						}
					);*/
				}
			}
			toast.push(
				ResetToken
					? 'Your password has been reset. Redirecting you to the authentication provider.'
					: 'Reset requested.'
			);
			localStorage.clear(); // Clear the storage
			if (!ResetToken) {
				localStorage.setItem('reset', 'true');
			}
			setTimeout(() => {
				goto(ResetToken ? '/auth/login' : '/auth/verify'); // Redirect to the login page to download the current user state.
			}, 2000);
		}, 500); // bounce every 500ms - let's hope they don't try to fucking spam the API
	}

	const handleSubmit = (event: Event) => {
		event.preventDefault();
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);

		if (valueArray[0].trim() != '') {
			resetting_password = true;
			Reset(valueArray);
		}
	};
</script>

<svelte:head>
	<title>UniFood | Password Reset</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content flex h-full items-center justify-center">
		<div class="rounded-xl border-gray-200 lg:border lg:bg-COLORBLK1 lg:shadow-sm">
			<div class="p-4 sm:p-7">
				<div class="text-center">
					<div class="mb-4 inline-block rounded-full bg-COLORGRY p-2 text-white">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
							/>
						</svg>
					</div>
					<h1 class="block text-2xl font-bold text-COLORWHT">
						{ResetToken ? 'Change your password' : 'Forgot password?'}
					</h1>
					<p class="mt-2 text-sm text-COLORWHT1">
						{ResetToken
							? 'Note that doing this will also sign out all of your devices'
							: "Don't worry we'll send you reset instructions."}
					</p>
				</div>

				<div class="mt-6">
					<!-- Form -->
					<form action="#" on:submit={(event) => handleSubmit(event)}>
						<div class="grid gap-y-4 text-COLORWHT2">
							<!-- Form Group -->
							<div>
								<label for="email" class="mb-2 block text-sm"
									>{ResetToken ? 'New password' : 'Email address or Username'}</label
								>
								<div class="relative">
									<input
										type="text"
										id="text"
										name="user_id"
										autocomplete="off"
										minlength="2"
										placeholder={ResetToken ? 'Typed password is shown in Cleartext' : 'User ID'}
										class="block w-full rounded-md bg-COLORBLK1 px-4 py-3 text-sm outline-none ring-offset-1 focus:ring-2"
										required
									/>
									<div
										bind:this={error_graphic}
										class="pointer-events-none right-0 top-3 hidden items-center px-3"
									>
										<svg
											class="h-5 w-5 text-rose-500"
											width="16"
											height="16"
											fill="currentColor"
											viewBox="0 0 16 16"
											aria-hidden="true"
										>
											<path
												d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
											/>
										</svg>
									</div>
									<p
										bind:this={error_message}
										class="mt-2 text-xs text-rose-600 peer-invalid:block"
										id="email-error"
									>
										{error_string}
									</p>
								</div>
							</div>
							<!-- Form Group -->

							<button
								type="submit"
								disabled={resetting_password}
								class="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-COLORGRY px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-80 focus:outline-none disabled:opacity-50"
								>Reset password</button
							>
						</div>
					</form>
					<!-- /Form -->
				</div>
				<p class="mt-3 block w-full divide-gray-300 text-center text-sm text-COLORWHT">
					<!-- <a class="pl-3 text-sm text-gray-600 decoration-2 hover:text-blue-600 hover:underline" href="#"> FAQs </a> -->
					<span class="inline pr-3">
						Remember your password?
						<a class="font-medium text-COLORGRY decoration-2 hover:underline" href="/auth/login">
							Sign in here
						</a>
					</span>
					<span class="hidden lg:inline"><br /></span>
					You may also
					<a
						class="pl-1 text-sm text-COLORGRY decoration-2 hover:underline"
						href="#contact-support"
						on:click={() => {
							window.open(
								`https://mail.google.com/mail/u/?authuser=${localStorage.getItem(
									'email'
								)}&view=cm&fs=1&to=${config['server']['support-email']}&su=${
									localStorage.getItem('email') ?? '[YOUR_NAME]'
								} — Support Request&body=User%20would%20like%20to%20file%20a%20support%20request.%0A%0AWrite%20your%20comment%20below%20this%20line.%0A------%0A%0A%0ABEFORE%20TYPING%20ANYTHING%20PLEASE%20AFFIX%20YOUR%20FULL%20NAME%20IN%20THE%20SUBJECT%20LINE!`,
								'_blank'
							);
						}}
						target="_blank"
					>
						Contact Support
					</a>
				</p>
			</div>
		</div>
	</div>
</main>
