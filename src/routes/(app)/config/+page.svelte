<!--
@files src/routes/(app)/config/+page.svelte
@component
**This file sets up and displays the config page. It provides a user-friendly interface for managing configuration settings.**
-->

<script lang="ts">
	import AdminPageShell from '@components/admin-page-shell.svelte';
	import Slot from '@components/system/slot.svelte';
	import AdminZone from '@src/components/system/admin-zone.svelte';
	import PermissionGuard from '@src/components/permission-guard.svelte';
	import { collections } from '@src/stores/collection-store.svelte';
	import { ui } from '@src/stores/ui-store.svelte.ts';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import {
		applayout_systemconfiguration,
		config_page_subtitle,
		config_tile_access,
		config_tile_api,
		config_tile_automations,
		config_tile_builder,
		config_tile_design,
		config_tile_extensions,
		config_tile_monitor,
		config_tile_queue,
		config_tile_redirects,
		config_tile_settings,
		config_tile_sync,
		config_tile_tenants,
		config_tile_trash,
		config_tile_webhooks,
		config_tile_workflows,
		config_tile_dashboard,
		config_tile_email
	} from '@src/paraglide/messages';

	let { data } = $props();

	const showTenantsTile = $derived(
		(page.data.isMultiTenant as boolean) && data.isAdmin && !page.data.tenantId
	);

	onMount(() => {
		collections.setCollection(null);
	});

	function handleMobileSidebarClose() {
		// Hide sidebar on mobile before navigation
		if (typeof window !== 'undefined' && window.innerWidth < 768) {
			ui.toggle('leftSidebar', 'hidden');
		}
	}

	// Icon grid — flat, scannable, mobile-first.
	// Order defines visual grouping. Comments mark domain boundaries.
	// Plugins that need a config page register here; plugins that only add
	// settings tabs or monitor panels don't need their own tile.
	const configItems = [
		// ── System ──
		{
			id: 'settings',
			href: '/config/system-settings',
			label: 'System Settings',
			icon: 'uil:setting',
			iconColor: '',
			permission: {
				contextId: 'config:settings',
				name: 'System Settings',
				description: 'Database and infrastructure configuration — extensible via plugins',
				requiredRole: 'admin',
				action: 'manage',
				contextType: 'system'
			}
		},
		{
			id: 'tenants',
			href: '/admin/tenants',
			label: 'Tenants',
			icon: 'mdi:office-building',
			iconColor: 'text-tertiary-500',
			visible: () => showTenantsTile,
			permission: {
				contextId: 'config:settings',
				name: 'Tenant Management',
				description: 'Manage multi-tenant workspaces and provisioning',
				requiredRole: 'admin',
				action: 'manage',
				contextType: 'system'
			}
		},
		{
			id: 'designSystem',
			href: '/config/design-system',
			label: 'Design System',
			icon: 'mdi:compass-outline',
			iconColor: 'text-tertiary-500',
			permission: {
				contextId: 'config:appearance',
				name: 'Design System',
				description: 'Appearance, themes, personal overrides, density, and live component preview',
				requiredRole: 'admin',
				action: 'manage',
				contextType: 'configuration'
			}
		},
		{
			id: 'monitor',
			href: '/config/monitor',
			label: 'System Monitor',
			icon: 'mdi:shield-check-outline',
			iconColor: '',
			permission: {
				contextId: 'config:systemMonitor',
				name: 'System Monitor',
				description: 'Health dashboard, audit log, and plugin status',
				requiredRole: 'admin',
				action: 'view',
				contextType: 'system'
			}
		},
		// ── Content ──
		{
			id: 'collectionbuilder',
			href: '/config/collectionbuilder',
			label: 'Collection Builder',
			icon: 'fluent-mdl2:build-definition',
			iconColor: '',
			permission: {
				contextId: 'config:collectionManagement',
				name: 'Collection Builder',
				description: 'Visual content-modeling and schema builder',
				requiredRole: 'admin',
				action: 'manage',
				contextType: 'configuration'
			}
		},
		// ── Security ──
		{
			id: 'accessManagement',
			href: '/config/access-management',
			label: 'Access Management',
			icon: 'mdi:account-group',
			iconColor: 'text-error-500',
			permission: {
				contextId: 'config:accessManagement',
				name: 'Access Management',
				description: 'Users, roles, permissions, and website tokens',
				requiredRole: 'admin',
				action: 'manage',
				contextType: 'configuration'
			}
		},
		// ── Extensions ──
		{
			id: 'extensions',
			href: '/config/extensions',
			label: 'Extensions',
			icon: 'mdi:puzzle-outline',
			iconColor: 'text-tertiary-500',
			permission: {
				contextId: 'config:extensions',
				name: 'Extensions',
				description: 'Plugins, widgets, themes, and marketplace',
				requiredRole: 'admin',
				action: 'manage',
				contextType: 'configuration'
			}
		},
		// ── Operations ──
		{
			id: 'automations',
			href: '/config/automations',
			label: 'Automations',
			icon: 'mdi:robot-outline',
			iconColor: 'text-warning-500',
			permission: {
				contextId: 'config:automations',
				name: 'Automations',
				description: 'Event-driven workflow automations',
				requiredRole: 'admin',
				action: 'manage',
				contextType: 'configuration'
			}
		},
		{
			id: 'workflows',
			href: '/config/workflows',
			label: 'Workflows',
			icon: 'mdi:state-machine',
			iconColor: 'text-primary-500',
			permission: {
				contextId: 'config:automations',
				name: 'Workflows',
				description: 'Content review stages and state transitions',
				requiredRole: 'admin',
				action: 'manage',
				contextType: 'configuration'
			}
		},
		{
			id: 'queue',
			href: '/config/queue',
			label: 'Background Queue',
			icon: 'mdi:playlist-play',
			iconColor: '',
			permission: {
				contextId: 'config:queue',
				name: 'Background Queue',
				description: 'Monitor background jobs and retry failed tasks',
				requiredRole: 'admin',
				action: 'view',
				contextType: 'system'
			}
		},
		{
			id: 'sync',
			href: '/config/sync',
			label: 'Data Sync',
			icon: 'mdi:sync-circle',
			iconColor: '',
			permission: {
				contextId: 'config:synchronization',
				name: 'Data Sync',
				description: 'Import content from external platforms and sync config to filesystem',
				requiredRole: 'admin',
				action: 'manage',
				contextType: 'system'
			}
		},
		// ── Tools ──
		{
			id: 'apiPlayground',
			href: '/config/api',
			label: 'API Playground',
			icon: 'mdi:api',
			iconColor: 'text-warning-500',
			permission: {
				contextId: 'api:graphql',
				name: 'API Playground',
				description: 'Interactive REST (OpenAPI) and GraphQL developer console',
				requiredRole: 'developer',
				action: 'access',
				contextType: 'system'
			}
		},
		{
			id: 'dashboard',
			href: '/dashboard',
			label: 'Dashboard',
			icon: 'bi:bar-chart-line',
			iconColor: 'text-error-600',
			permission: {
				contextId: 'system:dashboard',
				name: 'Dashboard',
				description: 'Content metrics and activity overview',
				requiredRole: 'user',
				action: 'access',
				contextType: 'system'
			}
		},
		{
			id: 'emailPreviews',
			href: '/email-previews',
			label: 'Email Previews',
			icon: 'mdi:email-outline',
			iconColor: '',
			target: '_blank',
			permission: {
				contextId: 'system:admin',
				name: 'Email Previews',
				description: 'Preview transactional email templates',
				requiredRole: 'admin',
				action: 'access',
				contextType: 'system'
			}
		},
		// ── TBD: features under review for final placement ──
		{
			id: 'webhooks',
			href: '/config/webhooks',
			label: 'Webhooks',
			icon: 'mdi:webhook',
			iconColor: 'text-warning-600',
			permission: {
				contextId: 'config:webhooks',
				name: 'Webhooks',
				description: 'Outgoing HTTP callbacks on content events',
				requiredRole: 'admin',
				action: 'manage',
				contextType: 'configuration'
			}
		},
		{
			id: 'redirects',
			href: '/config/redirects',
			label: 'Redirects',
			icon: 'mdi:arrow-decision',
			iconColor: 'text-tertiary-500',
			permission: {
				contextId: 'config:redirects',
				name: 'Redirects',
				description: '301/302 redirect rules with regex support',
				requiredRole: 'admin',
				action: 'manage',
				contextType: 'configuration'
			}
		},
		{
			id: 'trash',
			href: '/config/trash',
			label: 'Trash',
			icon: 'mdi:delete-restore',
			iconColor: 'text-error-500 dark:text-error-400',
			permission: {
				contextId: 'config:trash',
				name: 'Trash',
				description: 'Recover or permanently delete soft-deleted content',
				requiredRole: 'admin',
				action: 'manage',
				contextType: 'configuration'
			}
		}
	];

	const tileLabel = (id: string, fallback: string): string => {
		const labels: Record<string, () => string> = {
			settings: config_tile_settings,
			tenants: config_tile_tenants,
			designSystem: config_tile_design,
			monitor: config_tile_monitor,
			collectionbuilder: config_tile_builder,
			accessManagement: config_tile_access,
			extensions: config_tile_extensions,
			automations: config_tile_automations,
			workflows: config_tile_workflows,
			queue: config_tile_queue,
			sync: config_tile_sync,
			apiPlayground: config_tile_api,
			dashboard: config_tile_dashboard,
			emailPreviews: config_tile_email,
			webhooks: config_tile_webhooks,
			redirects: config_tile_redirects,
			trash: config_tile_trash
		};
		return labels[id]?.() ?? fallback;
	};
</script>

<AdminPageShell
	title={applayout_systemconfiguration()}
	showBackButton={true}
	backUrl="/"
	icon="material-symbols:build-circle"
>
	<!--
		Elevation hierarchy: page → recessed panel → raised tiles.
		The panel used to be an AdminCard, i.e. the SAME surface token as the
		tiles it contains, and the tiles only looked separate because they were
		hardcoded `bg-white`. A recessed panel gives the tiles their contrast back
		from the token layer, in both themes and under every theme preset.
	-->
	<section class="config-panel p-4 backdrop-blur-md">
		<!-- Section heading: one hue in both themes (it was tertiary blue in light,
		     primary green in dark, which read as a link that changes colour). -->
		<h2
			class="h2 mb-4 text-center font-bold text-surface-700 dark:text-surface-200"
			in:fly={{ y: -10, duration: 300 }}
		>
			{config_page_subtitle()}
		</h2>

		<!--
			ONE tile definition for both the guarded and the unguarded branch.
			They used to be two hand-copied blocks that had drifted apart:
			the guarded copy was missing the `group` class (so every
			`group-hover:` state on its icon and label was dead), its dark
			surface was surface-900 against the other's surface-800, and its
			label inherited the body colour where the other used surface-600.
			Every tile now renders from this snippet, so they cannot drift again.
		-->
		{#snippet configTile(item: (typeof configItems)[number])}
			<a
				href={item.href}
				class="config-tile group flex h-24 flex-col items-center justify-center gap-2 p-2 text-center transition-all duration-300 ease-out hover:-translate-y-1 lg:h-32"
				aria-label={tileLabel(item.id, item.label)}
				target={item.target}
				rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
				data-sveltekit-preload-data={item.target === '_blank' ? undefined : 'hover'}
				onclick={handleMobileSidebarClose}
			>
				<iconify-icon
					icon={item.icon}
					class="config-tile-icon text-3xl transition-transform duration-300 group-hover:scale-110 lg:text-4xl"
				></iconify-icon>
				<p
					class="config-tile-label w-full truncate text-xs font-medium uppercase tracking-wide lg:text-sm"
				>
					{tileLabel(item.id, item.label)}
				</p>
			</a>
		{/snippet}

		<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
			{#each configItems.filter((item) => !('visible' in item) || item.visible?.()) as item, idx (item.id || item.label)}
				{const usePermissionGuard = !!item.permission}

				{#if usePermissionGuard}
					<div in:fly={{ y: 20, delay: idx * 50, duration: 300 }}>
						<PermissionGuard {...{ config: item.permission } as any}>
							{@render configTile(item)}
						</PermissionGuard>
					</div>
				{:else}
					<div in:fly={{ y: 20, delay: idx * 50, duration: 300 }}>
						{@render configTile(item)}
					</div>
				{/if}
			{/each}

			<!-- Plugin config_grid slots (each plugin supplies its own tile GUI) -->
			<div class="contents" in:fly={{ y: 20, delay: configItems.length * 50, duration: 300 }}>
				<PermissionGuard
					{...{
						config: {
							contextId: 'config:extensions',
							name: 'Plugin Extensions',
							description: 'Plugin-owned config tiles and tools',
							requiredRole: 'admin',
							action: 'manage',
							contextType: 'configuration'
						}
					} as any}
				>
					<Slot
						name="config_grid"
						inline={true}
						props={{
							pluginStates: data?.pluginStates ?? {},
							isPro: false,
							enabled: data?.pluginStates?.['smart-importer'] ?? true
						}}
					/>
				</PermissionGuard>
			</div>

			<Slot name="config" props={{ pluginStates: data?.pluginStates ?? {} }} />
			<AdminZone zone="config" context={{ pluginStates: data?.pluginStates ?? {} }} />
		</div>
	</section>
</AdminPageShell>

<style>
	/*
	 * Tiles read the same --admin-* token layer as AdminCard, so they follow the
	 * active theme preset (Corporate / Editorial / Operations), the density
	 * setting and the card radius instead of the hardcoded `bg-white` /
	 * `dark:bg-surface-800|900` they used before.
	 */
	.config-panel {
		border-radius: var(--admin-radius-card, 0.75rem);
		border: var(--admin-border-width, 1px) solid
			var(--admin-border-subtle, var(--color-surface-200));
		background-color: color-mix(in oklch, var(--color-surface-500) 6%, transparent);
	}

	.config-tile {
		border-radius: var(--admin-radius-card, 0.75rem);
		border: var(--admin-border-width, 1px) solid
			var(--admin-border-default, var(--color-surface-200));
		background-color: var(--admin-bg-card, var(--color-surface-50));
		box-shadow: var(--admin-shadow-elevation, 0 1px 3px 0 rgb(0 0 0 / 0.1));
	}

	.config-tile:hover {
		border-color: var(--color-primary-500);
		background-color: color-mix(in oklch, var(--color-primary-500) 8%, transparent);
		box-shadow: var(--admin-shadow-elevated, 0 10px 15px -3px rgb(0 0 0 / 0.1));
	}

	/* One accent system: neutral at rest, brand primary on hover/focus — in BOTH
	   themes. The label used to be near-black in light and primary green in dark,
	   so the same grid read as two different designs. */
	.config-tile-icon,
	.config-tile-label {
		color: var(--admin-text-muted, var(--color-surface-500));
		transition: color var(--admin-motion-base, 200ms) var(--admin-ease-out, ease-out);
	}

	.config-tile-label {
		color: var(--admin-text-body, var(--color-surface-900));
	}

	.config-tile:hover .config-tile-icon,
	.config-tile:hover .config-tile-label,
	.config-tile:focus-visible .config-tile-icon,
	.config-tile:focus-visible .config-tile-label {
		color: var(--color-primary-600);
	}

	:global(html.dark) .config-tile:hover .config-tile-icon,
	:global(html.dark) .config-tile:hover .config-tile-label,
	:global(html.dark) .config-tile:focus-visible .config-tile-icon,
	:global(html.dark) .config-tile:focus-visible .config-tile-label {
		color: var(--color-primary-400);
	}

	@media (prefers-reduced-motion: reduce) {
		.config-tile,
		.config-tile-icon,
		.config-tile-label {
			transition: none;
		}

		.config-tile:hover {
			transform: none;
		}
	}
</style>
