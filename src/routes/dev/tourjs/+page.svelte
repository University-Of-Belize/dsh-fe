<script lang="ts">
	import { goto } from '$app/navigation';
	import Tour2 from '$lib/Elements/Tour/default.svelte';
	import type { TourConfig, TourSteps } from '@alexdev404/svelte-guide';
	import Tour from '@alexdev404/svelte-guide';
	import {
		faClone,
		faHamburger,
		faList,
		faMessage,
		faPlus,
		faQuestion,
		faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';

	const myTour: TourSteps[] = [
    {
      target: "#features",
      data: {
        title: "Wow",
        content: "Let's take a look at some features!",
      },
    },
    {
      target: "#feature1",
      data: {
        content:
          "No matter the browser size, I'm always in the right spot. Try resizing!",
      },
    },
    {
      target: "#feature2",
      data: {
        content:
          "By default, Tour puts your tooltips in the perfect spot, automagically!",
      },
    },
    {
      target: "#feature3",
      data: {
        content:
          "Promises are built in by default along with powerful before and after hooks for each step!",
      },
    },
    {
      target: "#feature4",
      data: {
        content:
          "Unlike intro.js, ng-joyride, and others, Tour.js will NOT relayer your elements, shuffle your z-indices or manipulate your existing DOM in any way.",
      },
    },
    {
      target: "#vader",
      data: {
        content: "Luke, come to the dark side... it's easily themable ;)",
      },
      before: function () {
        document.getElementById("vader").style.opacity = "100%";
        console.log("Before works!");
      },
      after: function () {
        console.log("After works");
      },
    },
    {
      target: "#installation",
      data: {
        content:
          "Installation is a breeze, and Tour.js is a lightweight (weighing in at about 12kb gzipped!)",
      },
      before: function () {
        document.getElementById("vader").style.opacity = "0%";
      },
    },
    {
      target: "#usage",
      data: { content: "Tours are ridiculously easy to build." },
    },
    {
      target: "#config",
      data: {
        content:
          "And customization is a snap! These are the defaults which you can override globally, per tour, or per step.",
      },
    },
    {
      target: "#api",
      data: { content: "A clean and simple API to get the job done." },
    },
    {
      target: "#promises",
      data: {
        content:
          "Built in hooks let you fine-tune and control your app state as the tour progresses!",
      },
    },
    {
      target: "#forkme_banner",
      data: { content: "I'll let you take it from here" },
    },
  ];

	const data = {
		what: '__dash',
		is: [
			[
				'super',
				[
					'User management',
					'Product wizard',
					"View what's queued",
					'Start a new category',
					'Create a new user'
				],
				['user', 'hamburger', 'clone', 'plus', 'plus']
			],
			[
				'4x',
				[
					'/admin/dashboard/user/',
					'/admin/dashboard/product/manage',
					'/admin/dashboard/order/',
					'/admin/dashboard/category/manage',
					'/admin/dashboard/user/manage'
				]
			]
		]
	};
	const staff = data.is[0][0] === 'super' ? true : false;
	localStorage.setItem('staff', staff.toString());
	const icons = data.is[0][2];
	const tourConfig: TourConfig = {
		theme: 'dark',
		customTourBoxWrapperCSS: `
		position: absolute;
		z-index: 20;
		transition: all 0.75s ease-in-out;`,
		customTemplate: Tour2
	};
	onMount(async () => {
		try {
			let tour = new Tour(myTour);
			tour
				.start()
				.then(() => {
					console.log('Tour Finished!');
				})
				.catch(() => {
					console.log('Tour Interrupted!');
				});

			// END IMPLEMENTATION
		} catch (error) {
			console.log(error);
			toast.push(`Oops. Something unexpected happened while loading the dash: ${error.message}`);
		}
	});
</script>

<svelte:head>
	<title>UniFood | Dashboard / Home</title>
</svelte:head>
<div class="content hidden h-full w-full overflow-auto bg-transparent px-16 py-16 lg:block">
	<div class="flex pb-2 text-2xl font-semibold">Fake Dashboard</div>
	<div id="features" class="flex pb-12 text-xl font-light">What would you like to do?</div>
	<div class="flex w-full flex-wrap">
		{#if data != undefined}
			{#each data.is[0][1] as shortcut, i}
				<div
					class="mx-4 my-4 h-56 w-56 cursor-pointer select-none rounded-sm bg-COLORBLK1 text-COLORWHT hover:opacity-80"
					on:click={() => goto(data.is[1][1][i] ?? '/admin/dashboard')}
				>
					<div class="flex h-full w-full items-center justify-center text-center">
						<div class="block">
							<div id="icon_dash" class="flex w-full items-center justify-center py-6">
								{#if icons[i]}{#if icons[i] === 'user'}
										<Fa
											icon={faUserCog}
											size={data.is[1][0] ?? '4x'}
										/>{:else if icons[i] === 'hamburger'}<Fa
											icon={faHamburger}
											size={data.is[1][0] ?? '4x'}
										/>{:else if icons[i] === 'list'}<Fa
											icon={faList}
											size={data.is[1][0] ?? '4x'}
										/>{:else if icons[i] === 'clone'}<Fa
											icon={faClone}
											size={data.is[1][0] ?? '4x'}
										/>{:else if icons[i] === 'plus'}<Fa
											icon={faPlus}
											size={data.is[1][0] ?? '4x'}
										/>{:else if icons[i] === 'message'}<Fa
											icon={faMessage}
											size={data.is[1][0] ?? '4x'}
										/>{:else}<Fa icon={faQuestion} size={data.is[1][0] ?? '4x'} />
									{/if}
								{/if}
							</div>
							<div class="description font-semibold">{shortcut}</div>
						</div>
					</div>
				</div>
			{/each}{:else}<div class="font-light">
				There was a problem while loading the shortcuts.
			</div>{/if}
	</div>
</div>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>
