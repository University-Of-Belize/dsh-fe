<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';
	import SearchBar from '$lib/Elements/Search/SearchBar.svelte';
	import type { Category } from '$lib/types/Category';
	import { faAd, faLock, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons';
// import type { Product as Product_ } from '$lib/types/Product.ts';
	import type { User } from '$lib/types/User';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faGift, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	let user: User = localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {};
	let categories: Category[] = [];
	let logging_in: boolean = false;
	let debounceTimeout: number;
	// let product: Product_[] | null;

	onMount(async () => {
		try {
			const res = (await fetchWebApi('v1/menu/random', 'GET')) as Response;
			if (!res) return;
			// const r = await res.json();
			// product = r.is;
			getCategories();
			// console.log(product);
		} catch (error) {
			console.log(error);
			toast.push(
				`Oops. Something unexpected happened while contacting our servers: ${
					error?.message ?? 'Error unavailable.'
				}`
			);
		}
	});
	async function getCategories() {
		const response = (await fetchWebApi('v1/category', 'GET')) as Response;
		const data = await response.json();
		categories = data.is; // Category[]
		categories = categories.filter((category: Category) => !category.hidden);
		if (localStorage.categories) {
			if (localStorage.categories !== JSON.stringify(categories)) {
				localStorage.removeItem('categories'); // Time for an update
			}
		}
	}

	// Login stuff

	const handleSubmit = (event: Event) => {
		event.preventDefault();
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);

		if (valueArray[0].trim() != '') {
			logging_in = true;
			Login(valueArray);
		}
	};

	async function Login(payload: any) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const r = (await fetchWebApi(
				'v1/auth/login',
				'POST',
				what_is(what.public.auth, payload),
				false,
				undefined,
				true
			)) as Response;
			if (!r) return;
			if (!r.ok) {
				setTimeout(() => {
					logging_in = false; // Slight "bounce"
				}, 450);
				try {
					const res = await r.json();
					return toast.push(res.message, {
						dismissable: false,
						theme: {
							'--toastBarBackground': 'rgb(var(--COLORRED))'
						}
					});
				} catch (error) {
					return toast.push(
						'Could not log you in. Check your username and password and try again.',
						{
							dismissable: false,
							theme: {
								'--toastBarBackground': 'rgb(var(--COLORRED))'
							}
						}
					);
				}
			}
			const res = await r.json();
			localStorage.setItem('user_id', res.is[0]);
			localStorage.setItem('token', res.is[1]);
			// Remove 'oops' or 'blocked' if exist
			localStorage.removeItem('oops');
			localStorage.removeItem('blocked');
			toast.push('Welcome back!');
			setTimeout(() => {
				goto('/admin/dashboard'); // Redirect to the login page to download the current user state.
			}, 2000);
		}, 500); // bounce every 500ms - let's hope they don't try to fucking spam the API
	}
</script>

<main class="h-screen w-full">
	<div class="hero">
		<div
			class="image-and-wrapper relative"
			style="height: {localStorage.token ? '100vh' : '800px'}"
		>
			<div class="content-wrapper absolute z-10 flex h-full w-full items-center justify-center">
				<div class="navigation absolute top-0 w-full">
					<!--- whitespace triggers nav and needs fixing-->
					<Navigation transparency={25} search={true} />
				</div>
				{#if !localStorage.token}
					<div class="content flex flex-1 items-center justify-center">
						<div class="content-wrapper block px-4 md:px-8 lg:px-0">
							<div
								class="running-heading flex w-full items-center justify-center py-10 text-5xl font-medium text-COLORWHT md:text-7xl"
							>
								<div class="block">
									Plattr is an online<br />ordering system.<br />

									<div class="mt-6 text-sm font-light">
										<b class="font-normal">Online Test #1 is officially here!</b> Sign up using the button
										below 👇
									</div>
									<!-- Order Anytime,<br /> Anywhere -->
								</div>
							</div>
							<div class="running-subheading">
								<div
									class="w-fit"
									on:click={() => {
										goto('/auth/login');
									}}
								>
									<Button
										icon={faRightToBracket}
										color="COLORBLK2"
										color_t="COLORWHT"
										text="Log in"
									/>
								</div>
							</div>
						</div>
					</div>{/if}
				<div
					class="content2 {localStorage.token
						? 'flex'
						: 'hidden'} flex-1 items-center justify-center text-COLORWHT lg:flex"
				>
					<div class="block rounded-md bg-COLORBLK1 py-16 text-center text-2xl md:w-2/4">
						{#if !localStorage.token}
							<div class="hidden lg:block">
								<div class="mb-8">Existing user? Login.</div>
								<form class="block" action="#" on:submit={(event) => handleSubmit(event)}>
									<div
										class="inputgroup mx-8 flex flex-wrap items-start justify-start lg:items-center"
									>
										<TextInput
											icon={faAd}
											name="username"
											placeholder="Type in a username"
											custom_style="bg-transparent"
											required
										/>
									</div>
									<div
										class="inputgroup mx-8 flex flex-wrap items-start justify-start lg:items-center"
									>
										<TextInput
											icon={faLock}
											name="password"
											type="password"
											placeholder="Type in your password"
											custom_style="bg-transparent"
											required
										/>
									</div>
									<a href="/auth/password_reset" class="mx-8 block w-fit">
										<div
											on:keypress={() => goto('/auth/password_reset')}
											on:click={() => goto('/auth/password_reset')}
											class="forgot-password flex w-fit cursor-pointer space-x-2 pt-4 text-sm font-semibold text-COLORWHT hover:underline"
										>
											<div class="icon"><Fa icon={faUnlockKeyhole} /></div>
											<div>Forgot Password?</div>
										</div></a
									>
									<div class="submit mx-8 mt-6 flex flex-1 items-center justify-center">
										<button
											class="submit w-full"
											type="submit"
											disabled={logging_in}
											title={logging_in ? 'Please wait for the request to complete' : ''}
										>
											<Button
												icon={faRightToBracket}
												color="COLORWHT"
												color_t="COLORBLK"
												custom_style="w-full justify-center"
												text="Log in"
												disabled={logging_in}
											/>
										</button>
									</div>
								</form>
							</div>
						{:else}
							<div class="mx-8 font-light">
								<div>Thanks for logging in, <b class="font-normal">@{user.username}</b>! :)</div>
								<div class="mt-1 flex w-full items-center justify-center text-xs font-light italic">
									"{#await (async () => {
										const quote = 'https://api.quotable.io/random?maxLength=53';
										const r = await fetch(quote);
										if (!r.ok) return;
										const res = await r.json();
										return res.content;
									})()}
										<p>Loading quote...</p>
									{:then quote}
										<p>{quote}</p>
									{:catch error}
										<p>Error: {error.message}</p>
									{/await}"
								</div>
								<div class="mt-8"><SearchBar /></div>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<div
				class="wrapper absolute flex h-full w-full items-center justify-center bg-COLORBLK opacity-20"
			>
				<!-- Nothing, this is an overlay-->
			</div>
			<div class="hero-image h-full w-full" />
		</div>
	</div>
	<!--
	<div class="content block">
		<div class="category-grid flex justify-center items-center w-full flex-wrap">
			<div class="gridelement h-16 w-full flex justify-center items-center relative bg-COLORBLK">
				<div
					class="content-wrapper w-full h-full absolute flex items-center justify-start text-2xl font-semibold text-COLORWHT bg-COLORBLK px-8 z-10"
				>
					Categories
				</div>
			</div>
		</div>
		<div
			class="category-grid ltr flex flex-wrap justify-center items-center w-full h-96 overflow-auto"
		>
			{#if categories.length > 0}
				{#each categories as category}
					<div
						class="gridelement flex-grow flex-shrink-0 lg:basis-1/4 h-full w-full flex justify-center items-center relative hover:opacity-80 cursor-pointer"
					>
						<div
							class="content-wrapper w-full h-full absolute flex items-center justify-center text-7xl font-semibold text-COLORWHT z-10"
							on:click={() => {
								goto(
									`/product?filter=${
										category.name
											? category.name.toString().toLowerCase()
											: category.alias.toString().toLowerCase()
									}`
								);
							}}
						>
							{category.alias ?? category.name}
						</div>

						<div
							class="wrapper bg-COLORBLK opacity-50 w-full h-full absolute flex items-center justify-center"
						>
							<!-- Nothing, this is an overlay--
						</div>
						<div
							class="hero-image-base h-full w-full"
							style="background-image: url('{category.image ||
								config['home-page']['default-image']}'); "
							on:error={() => {
								document.querySelector(
									'.hero-image-base'
								).style.backgroundImage = `url(${config['home-page']['default-image']})`;
							}}
						/>
					</div>
				{/each}
			{:else}
				<div class="gridelement h-full w-full flex justify-center items-center relative">
					<div
						class="content-wrapper w-full h-full absolute flex items-center justify-center text-7xl font-semibold text-COLORWHT z-10"
					>
						<!-- Loading data... --
					</div>

					<div
						class="wrapper bg-COLORBLK1 opacity-50 w-full h-full absolute flex items-center justify-center"
					>
						<!-- Nothing, this is an overlay--
					</div>
					<div class="hero-image-1 h-full w-full" />
				</div>
			{/if}
		</div>

		<div class="gridelement h-16 w-full flex justify-center items-center relative">
			<div
				class="content-wrapper w-full h-full absolute flex items-center justify-start text-2xl font-semibold text-COLORWHT bg-COLORBLK1 px-8 z-10"
			/>
		</div>
	</div>
	<div class="featured block">
		<div
			class="banner-featured flex justify-start items-center text-2xl bg-COLORBLK1 font-semibold text-COLORWHT px-8 py-12"
		>
			Daily Special
		</div>
		{#if product}
			{#each product as product}
				<div class="flex w-full">
					<ProductBanner
						id={product._id}
						image={product.image}
						name={product.productName}
						description={product.description}
						price={product.price?.$numberDecimal}
						slug={product.slug}
						reviews={product.reviews}
					/>
				</div>{/each}
		{/if}
	</div>
	--->
	{#if !localStorage.token}
		<Footer text="There's more to explore">
			<div class="block">
				<div class="text-xl font-light">Shop our entire menu by creating an account</div>
				<div
					class="btn-wrp flex w-full items-center justify-center p-2"
					on:click={async () => {
						await goto('/auth/signup');
					}}
				>
					<Button icon={faGift} color="COLORPNK" text="Sign up" color_t="COLORWHT" />
				</div>
			</div>
		</Footer>{/if}
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}

	.hero-image {
		background-image: var(--LANDINGPHOTO) !important;
		background-size: cover;
	}
	.hero-image-base {
		background-size: cover;
	}

	.rtl {
		direction: rtl;
	}
	/* .ltr {
        direction: ltr;
    } */
	.rtl::-webkit-scrollbar {
		width: 15px;
	}
	.ltr::-webkit-scrollbar {
		width: 15px;
	}

	@media (max-width: 640px) {
		.ltr::-webkit-scrollbar {
			width: 8px;
		}
	}
</style>
