export function createSettingsPage(ctx) {
  const {
    escapeHtml,
    getGeneratedInviteLink,
    getSettingsMealModalId,
    getSettingsSupplierModalId,
    getSettingsWorkSectionModalId,
    getState,
    getSettingsUserModalError,
    getSettingsUserModalOpen,
    icon,
    mealCategoryLabel,
    money,
    renderAdminBackButton,
    renderEmptyState,
    getSettingsActiveTab,
    roleName
  } = ctx;

  const settingsPageClass = `
    mx-auto grid w-full max-w-7xl gap-3 text-stone-950
    [&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:font-black [&_h1]:leading-tight [&_h1]:tracking-normal sm:[&_h1]:text-[30px] [&_h2]:m-0 [&_h2]:text-lg [&_h2]:font-black [&_p]:m-0 [&_p]:text-sm [&_p]:text-stone-500
    [&_.settings-shell]:flex [&_.settings-shell]:flex-col [&_.settings-shell]:gap-5 lg:[&_.settings-shell]:flex-row lg:[&_.settings-shell]:items-start
    [&_.settings-nav-column]:w-full lg:[&_.settings-nav-column]:sticky lg:[&_.settings-nav-column]:top-20 lg:[&_.settings-nav-column]:w-72 lg:[&_.settings-nav-column]:shrink-0
    [&_.settings-nav-card]:rounded-[24px] [&_.settings-nav-card]:border [&_.settings-nav-card]:border-stone-200/80 [&_.settings-nav-card]:bg-white [&_.settings-nav-card]:p-3 [&_.settings-nav-card]:shadow-[0_14px_32px_rgba(25,27,24,.06)]
    [&_.settings-nav-title]:border-b [&_.settings-nav-title]:border-stone-100 [&_.settings-nav-title]:px-4 [&_.settings-nav-title]:py-3 [&_.settings-nav-title_span]:text-[10px] [&_.settings-nav-title_span]:font-black [&_.settings-nav-title_span]:uppercase [&_.settings-nav-title_span]:tracking-[.18em] [&_.settings-nav-title_span]:text-stone-400
    [&_.settings-menu]:mt-2 [&_.settings-menu]:grid [&_.settings-menu]:gap-1
    [&_.settings-menu_button]:flex [&_.settings-menu_button]:min-h-12 [&_.settings-menu_button]:w-full [&_.settings-menu_button]:items-center [&_.settings-menu_button]:gap-3 [&_.settings-menu_button]:rounded-xl [&_.settings-menu_button]:border-0 [&_.settings-menu_button]:bg-transparent [&_.settings-menu_button]:px-4 [&_.settings-menu_button]:text-left [&_.settings-menu_button]:text-xs [&_.settings-menu_button]:font-black [&_.settings-menu_button]:text-stone-600 [&_.settings-menu_button]:transition-all hover:[&_.settings-menu_button]:bg-orange-50 hover:[&_.settings-menu_button]:text-orange-700
    [&_.settings-menu_button.is-active]:bg-orange-600 [&_.settings-menu_button.is-active]:text-white [&_.settings-menu_button.is-active]:shadow-[0_14px_24px_rgba(239,91,29,.18)]
    [&_.settings-menu_button_svg]:text-stone-400 hover:[&_.settings-menu_button_svg]:text-orange-700 [&_.settings-menu_button.is-active_svg]:text-white
    [&_.settings-menu-dot]:ml-auto [&_.settings-menu-dot]:h-1.5 [&_.settings-menu-dot]:w-1.5 [&_.settings-menu-dot]:rounded-full [&_.settings-menu-dot]:bg-current [&_.settings-menu-dot]:opacity-35
    [&_.settings-content]:grid [&_.settings-content]:min-w-0 [&_.settings-content]:flex-1 [&_.settings-content]:gap-5
    [&_.settings-header]:relative [&_.settings-header]:overflow-hidden [&_.settings-header]:rounded-[32px] [&_.settings-header]:border [&_.settings-header]:border-stone-200/80 [&_.settings-header]:bg-white [&_.settings-header]:px-5 [&_.settings-header]:py-5 [&_.settings-header]:text-stone-950 [&_.settings-header]:shadow-sm sm:[&_.settings-header]:px-8
    [&_.settings-header-main]:relative [&_.settings-header-main]:flex [&_.settings-header-main]:items-center [&_.settings-header-main]:justify-between [&_.settings-header-main]:gap-4
    [&_.settings-header-copy]:flex [&_.settings-header-copy]:min-w-0 [&_.settings-header-copy]:items-center [&_.settings-header-copy]:gap-4
    [&_.settings-header-icon]:grid [&_.settings-header-icon]:h-12 [&_.settings-header-icon]:w-12 [&_.settings-header-icon]:shrink-0 [&_.settings-header-icon]:place-items-center [&_.settings-header-icon]:rounded-2xl [&_.settings-header-icon]:bg-orange-600 [&_.settings-header-icon]:text-white [&_.settings-header-icon]:shadow-[0_16px_28px_rgba(239,91,29,.22)]
    [&_.compact-kicker]:mb-1 [&_.compact-kicker]:block [&_.compact-kicker]:text-[10px] [&_.compact-kicker]:font-black [&_.compact-kicker]:uppercase [&_.compact-kicker]:tracking-[.18em] [&_.compact-kicker]:text-orange-700
    [&_.settings-header_p]:mt-1 [&_.settings-header_p]:max-w-3xl [&_.settings-header_p]:text-[10px] [&_.settings-header_p]:font-black [&_.settings-header_p]:uppercase [&_.settings-header_p]:tracking-[.16em] [&_.settings-header_p]:text-stone-400
    [&_.settings-header-badge]:hidden [&_.settings-header-badge]:shrink-0 [&_.settings-header-badge]:rounded-full [&_.settings-header-badge]:border [&_.settings-header-badge]:border-stone-200 [&_.settings-header-badge]:bg-stone-50 [&_.settings-header-badge]:px-3 [&_.settings-header-badge]:py-1 [&_.settings-header-badge]:text-[10px] [&_.settings-header-badge]:font-black [&_.settings-header-badge]:uppercase [&_.settings-header-badge]:tracking-[.12em] [&_.settings-header-badge]:text-stone-500 sm:[&_.settings-header-badge]:inline-flex
    [&_.settings-layout]:grid [&_.settings-layout]:gap-7
    [&_.settings-panel]:grid [&_.settings-panel]:gap-4 [&_.settings-panel]:overflow-hidden [&_.settings-panel]:rounded-[24px] [&_.settings-panel]:border [&_.settings-panel]:border-stone-200/80 [&_.settings-panel]:bg-white [&_.settings-panel]:p-5 [&_.settings-panel]:shadow-sm
    [&_.settings-panel-wide]:lg:col-span-2
    [&_.settings-panel-title]:-mx-5 [&_.settings-panel-title]:-mt-5 [&_.settings-panel-title]:flex [&_.settings-panel-title]:items-start [&_.settings-panel-title]:justify-between [&_.settings-panel-title]:gap-3 [&_.settings-panel-title]:border-b [&_.settings-panel-title]:border-stone-100 [&_.settings-panel-title]:bg-[#fafaf8] [&_.settings-panel-title]:px-5 [&_.settings-panel-title]:py-4 [&_.settings-panel-title>span]:grid [&_.settings-panel-title>span]:h-10 [&_.settings-panel-title>span]:w-10 [&_.settings-panel-title>span]:shrink-0 [&_.settings-panel-title>span]:place-items-center [&_.settings-panel-title>span]:rounded-xl [&_.settings-panel-title>span]:bg-orange-50 [&_.settings-panel-title>span]:text-orange-700 [&_.settings-panel-title_h2]:text-base [&_.settings-panel-title_h2]:font-black [&_.settings-panel-title_p]:mt-0.5 [&_.settings-panel-title_p]:text-[10px] [&_.settings-panel-title_p]:font-black [&_.settings-panel-title_p]:uppercase [&_.settings-panel-title_p]:tracking-[.14em] [&_.settings-panel-title_p]:text-stone-400
    [&_.form-grid]:grid [&_.form-grid]:gap-3 sm:[&_.form-grid]:grid-cols-2
    [&_.field]:grid [&_.field]:gap-1.5 [&_.field_label]:text-[10px] [&_.field_label]:font-black [&_.field_label]:uppercase [&_.field_label]:tracking-[.1em] [&_.field_label]:text-stone-400
    [&_input]:min-h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-stone-200 [&_input]:bg-stone-50/60 [&_input]:px-3 [&_input]:text-sm [&_input]:font-bold [&_input]:outline-none focus:[&_input]:border-orange-500 focus:[&_input]:bg-white focus:[&_input]:ring-4 focus:[&_input]:ring-orange-100 disabled:[&_input]:bg-stone-100 disabled:[&_input]:text-stone-500
    [&_select]:min-h-11 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-stone-200 [&_select]:bg-stone-50/60 [&_select]:px-3 [&_select]:text-sm [&_select]:font-bold [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-stone-200 [&_textarea]:bg-stone-50/60 [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-sm [&_textarea]:font-bold
    [&_.settings-actions]:flex [&_.settings-actions]:justify-end [&_.settings-actions]:gap-2 [&_.btn]:inline-flex [&_.btn]:min-h-11 [&_.btn]:items-center [&_.btn]:justify-center [&_.btn]:gap-2 [&_.btn]:rounded-xl [&_.btn]:border [&_.btn]:border-transparent [&_.btn]:px-5 [&_.btn]:text-[10px] [&_.btn]:font-black [&_.btn]:uppercase [&_.btn]:tracking-[.12em] [&_.btn.primary]:border-orange-600 [&_.btn.primary]:bg-orange-600 [&_.btn.primary]:text-white [&_.btn.primary]:shadow-[0_14px_22px_rgba(239,91,29,.16)] [&_.btn.outline]:border-stone-200 [&_.btn.outline]:bg-white [&_.btn.outline]:text-stone-700 hover:[&_.btn.outline]:border-orange-200 hover:[&_.btn.outline]:bg-orange-50 hover:[&_.btn.outline]:text-orange-700 [&_.btn.small]:min-h-9 [&_.btn.small]:px-3 [&_.btn.small]:text-[9px]
    [&_.settings-back-row]:min-h-6 [&_.settings-back-row]:flex [&_.settings-back-row]:items-center
    [&_.admin-back-button]:inline-flex [&_.admin-back-button]:min-h-5 [&_.admin-back-button]:items-center [&_.admin-back-button]:gap-1.5 [&_.admin-back-button]:border-0 [&_.admin-back-button]:bg-transparent [&_.admin-back-button]:p-0 [&_.admin-back-button]:text-xs [&_.admin-back-button]:font-extrabold [&_.admin-back-button]:text-stone-500 [&_.admin-back-button]:shadow-none [&_.admin-back-button]:transition hover:[&_.admin-back-button]:text-orange-700
    [&_.invite-link-box]:grid [&_.invite-link-box]:gap-2 [&_.invite-link-box]:rounded-xl [&_.invite-link-box]:border [&_.invite-link-box]:border-orange-200 [&_.invite-link-box]:bg-orange-50 [&_.invite-link-box]:p-3 [&_.invite-link-box_span]:text-[10px] [&_.invite-link-box_span]:font-black [&_.invite-link-box_span]:uppercase [&_.invite-link-box_strong]:break-all [&_.invite-link-box_strong]:text-sm
    lg:[&_.work-section-panel]:col-span-2 [&_.work-section-panel]:gap-3 [&_.work-section-panel_.settings-panel-title]:py-2.5 [&_.work-section-panel_.settings-panel-title>span]:h-8 [&_.work-section-panel_.settings-panel-title>span]:w-8 [&_.work-section-panel_h2]:text-base [&_.work-section-panel_p]:text-xs
    [&_.work-section-new]:rounded-xl [&_.work-section-new]:border [&_.work-section-new]:border-orange-200 [&_.work-section-new]:bg-orange-50/60 [&_.work-section-new]:p-3
    [&_.work-section-form]:grid [&_.work-section-form]:gap-2 sm:[&_.work-section-form]:grid-cols-[minmax(0,1.4fr)_90px_minmax(0,1fr)_96px_auto] sm:[&_.work-section-form]:items-end
    [&_.work-section-list]:grid [&_.work-section-list]:grid-cols-1 [&_.work-section-list]:gap-2 sm:[&_.work-section-list]:grid-cols-2 xl:[&_.work-section-list]:grid-cols-3
    [&_.work-section-card]:grid [&_.work-section-card]:gap-2 [&_.work-section-card]:rounded-xl [&_.work-section-card]:border [&_.work-section-card]:border-dashed [&_.work-section-card]:border-stone-200 [&_.work-section-card]:bg-[#fffefa] [&_.work-section-card]:p-3 [&_.work-section-card]:shadow-sm
    [&_.work-section-card-head]:grid [&_.work-section-card-head]:grid-cols-[minmax(0,1fr)_auto] [&_.work-section-card-head]:items-start [&_.work-section-card-head]:gap-2 [&_.work-section-card_strong]:truncate [&_.work-section-card_strong]:text-sm [&_.work-section-card_small]:text-xs [&_.work-section-actions]:grid [&_.work-section-actions]:grid-cols-2 [&_.work-section-actions]:gap-2
    lg:[&_.meal-catalog-panel]:col-span-2 [&_.meal-catalog-panel]:gap-3 [&_.meal-catalog-panel_.settings-panel-title]:py-2.5 [&_.meal-catalog-panel_.settings-panel-title>span]:h-8 [&_.meal-catalog-panel_.settings-panel-title>span]:w-8 [&_.meal-catalog-panel_h2]:text-base [&_.meal-catalog-panel_p]:text-xs
    [&_.meal-catalog-toolbar]:flex [&_.meal-catalog-toolbar]:items-center [&_.meal-catalog-toolbar]:justify-between [&_.meal-catalog-toolbar]:gap-3
    [&_.meal-catalog-list]:grid [&_.meal-catalog-list]:grid-cols-2 [&_.meal-catalog-list]:gap-2 sm:[&_.meal-catalog-list]:grid-cols-2 xl:[&_.meal-catalog-list]:grid-cols-3
    [&_.meal-catalog-card]:grid [&_.meal-catalog-card]:min-w-0 [&_.meal-catalog-card]:gap-2 [&_.meal-catalog-card]:rounded-r-xl [&_.meal-catalog-card]:rounded-l-md [&_.meal-catalog-card]:border [&_.meal-catalog-card]:border-l-2 [&_.meal-catalog-card]:border-dashed [&_.meal-catalog-card]:border-stone-200 [&_.meal-catalog-card]:bg-[#fffefa] [&_.meal-catalog-card]:p-3 [&_.meal-catalog-card]:shadow-sm
    [&_.meal-catalog-card-head]:grid [&_.meal-catalog-card-head]:grid-cols-[minmax(0,1fr)_auto] [&_.meal-catalog-card-head]:items-start [&_.meal-catalog-card-head]:gap-2 [&_.meal-catalog-card-title]:min-w-0 [&_.meal-catalog-card-title_strong]:block [&_.meal-catalog-card-title_strong]:truncate [&_.meal-catalog-card-title_strong]:text-sm [&_.meal-catalog-card-title_strong]:font-black [&_.meal-catalog-card-title_p]:mt-1 [&_.meal-catalog-card-title_p]:line-clamp-2 [&_.meal-catalog-card-title_p]:text-xs [&_.meal-catalog-card-actions]:flex [&_.meal-catalog-card-actions]:gap-1
    [&_.meal-price-chip]:inline-flex [&_.meal-price-chip]:w-max [&_.meal-price-chip]:items-center [&_.meal-price-chip]:rounded-full [&_.meal-price-chip]:border [&_.meal-price-chip]:border-orange-200 [&_.meal-price-chip]:bg-orange-50 [&_.meal-price-chip]:px-2 [&_.meal-price-chip]:py-1 [&_.meal-price-chip]:text-[10px] [&_.meal-price-chip]:font-black [&_.meal-price-chip]:text-orange-700
    [&_.meal-status-chip]:inline-flex [&_.meal-status-chip]:w-max [&_.meal-status-chip]:items-center [&_.meal-status-chip]:rounded-full [&_.meal-status-chip]:border [&_.meal-status-chip]:px-2 [&_.meal-status-chip]:py-1 [&_.meal-status-chip]:text-[10px] [&_.meal-status-chip]:font-black [&_.meal-status-chip]:uppercase [&_.meal-status-chip]:tracking-[.08em] [&_.meal-status-chip.active]:border-emerald-200 [&_.meal-status-chip.active]:bg-emerald-50 [&_.meal-status-chip.active]:text-emerald-700 [&_.meal-status-chip.inactive]:border-stone-200 [&_.meal-status-chip.inactive]:bg-stone-100 [&_.meal-status-chip.inactive]:text-stone-500
    [&_.icon-btn]:grid [&_.icon-btn]:h-9 [&_.icon-btn]:w-9 [&_.icon-btn]:place-items-center [&_.icon-btn]:rounded-lg [&_.icon-btn]:border [&_.icon-btn]:border-stone-300 [&_.icon-btn]:bg-white [&_.icon-btn]:p-0 [&_.icon-btn]:text-stone-800 hover:[&_.icon-btn]:border-orange-300 hover:[&_.icon-btn]:bg-orange-50 hover:[&_.icon-btn]:text-orange-700 [&_.icon-btn.danger]:border-red-200 [&_.icon-btn.danger]:bg-red-50 [&_.icon-btn.danger]:text-red-700 hover:[&_.icon-btn.danger]:border-red-300 hover:[&_.icon-btn.danger]:bg-red-100
    [&_.meal-catalog-edit]:overflow-hidden [&_.meal-catalog-edit]:rounded-xl [&_.meal-catalog-edit]:border [&_.meal-catalog-edit]:border-stone-200 [&_.meal-catalog-edit]:bg-white [&_.meal-catalog-edit_summary]:flex [&_.meal-catalog-edit_summary]:min-h-9 [&_.meal-catalog-edit_summary]:cursor-pointer [&_.meal-catalog-edit_summary]:list-none [&_.meal-catalog-edit_summary]:items-center [&_.meal-catalog-edit_summary]:justify-center [&_.meal-catalog-edit_summary]:gap-2 [&_.meal-catalog-edit_summary]:px-3 [&_.meal-catalog-edit_summary]:text-xs [&_.meal-catalog-edit_summary]:font-black [&_.meal-catalog-edit_summary::-webkit-details-marker]:hidden [&_.meal-catalog-item]:grid [&_.meal-catalog-item]:gap-2 [&_.meal-catalog-item]:border-t [&_.meal-catalog-item]:border-stone-100 [&_.meal-catalog-item]:p-3 [&_.meal-catalog-item_.form-grid]:gap-2 [&_.meal-catalog-item_textarea]:min-h-[4.25rem] [&_.meal-catalog-item_textarea]:py-1.5 [&_.meal-catalog-footer]:flex [&_.meal-catalog-footer]:items-center [&_.meal-catalog-footer]:justify-between [&_.meal-catalog-footer]:gap-2 [&_.meal-catalog-footer]:border-t [&_.meal-catalog-footer]:border-stone-100 [&_.meal-catalog-footer]:pt-2 [&_.meal-catalog-footer_span]:text-xs [&_.meal-catalog-new]:overflow-hidden [&_.meal-catalog-new]:rounded-[14px] [&_.meal-catalog-new]:border [&_.meal-catalog-new]:border-orange-200 [&_.meal-catalog-new]:bg-orange-50/60
    [&_.meal-catalog-new_summary]:flex [&_.meal-catalog-new_summary]:min-h-11 [&_.meal-catalog-new_summary]:cursor-pointer [&_.meal-catalog-new_summary]:list-none [&_.meal-catalog-new_summary]:items-center [&_.meal-catalog-new_summary]:justify-between [&_.meal-catalog-new_summary]:gap-2 [&_.meal-catalog-new_summary]:px-3 [&_.meal-catalog-new_summary]:text-sm [&_.meal-catalog-new_summary]:font-black [&_.meal-catalog-new_summary]:text-orange-700 [&_.meal-catalog-new_summary::-webkit-details-marker]:hidden
    [&_.meal-catalog-new-form]:grid [&_.meal-catalog-new-form]:gap-3 [&_.meal-catalog-new-form]:border-t [&_.meal-catalog-new-form]:border-orange-100 [&_.meal-catalog-new-form]:bg-white/80 [&_.meal-catalog-new-form]:p-3
    [&_.empty]:rounded-xl [&_.empty]:border [&_.empty]:border-dashed [&_.empty]:border-stone-300 [&_.empty]:bg-stone-50 [&_.empty]:p-5 [&_.empty]:text-center [&_.empty]:text-sm [&_.empty]:font-bold [&_.empty]:text-stone-500
    [&_.settings-overview]:grid [&_.settings-overview]:gap-2 sm:[&_.settings-overview]:grid-cols-2 xl:[&_.settings-overview]:grid-cols-4
    [&_.settings-stat]:grid [&_.settings-stat]:grid-cols-[40px_minmax(0,1fr)] [&_.settings-stat]:items-center [&_.settings-stat]:gap-3 [&_.settings-stat]:rounded-2xl [&_.settings-stat]:border [&_.settings-stat]:border-stone-200/80 [&_.settings-stat]:bg-white [&_.settings-stat]:p-3 [&_.settings-stat]:shadow-sm
    [&_.settings-stat-icon]:grid [&_.settings-stat-icon]:h-10 [&_.settings-stat-icon]:w-10 [&_.settings-stat-icon]:place-items-center [&_.settings-stat-icon]:rounded-xl [&_.settings-stat-icon]:bg-orange-50 [&_.settings-stat-icon]:text-orange-700
    [&_.settings-stat_strong]:block [&_.settings-stat_strong]:text-xl [&_.settings-stat_strong]:font-black [&_.settings-stat_strong]:leading-none [&_.settings-stat_span]:block [&_.settings-stat_span]:mt-1 [&_.settings-stat_span]:text-[10px] [&_.settings-stat_span]:font-black [&_.settings-stat_span]:uppercase [&_.settings-stat_span]:tracking-[.08em] [&_.settings-stat_span]:text-stone-500
    [&_.settings-section]:scroll-mt-20 [&_.settings-section]:grid [&_.settings-section]:gap-3
    [&_.settings-section-head]:flex [&_.settings-section-head]:items-end [&_.settings-section-head]:justify-between [&_.settings-section-head]:gap-3 [&_.settings-section-head]:border-b [&_.settings-section-head]:border-stone-200/80 [&_.settings-section-head]:pb-2
    [&_.settings-section-head_h2]:text-base [&_.settings-section-head_h2]:font-black [&_.settings-section-head_p]:mt-1 [&_.settings-section-head_p]:text-xs [&_.settings-section-head_p]:font-bold [&_.settings-section-head_p]:text-stone-500
    [&_.settings-section-grid]:grid [&_.settings-section-grid]:gap-3
    [&_.settings-section-grid>.settings-panel-wide]:lg:col-span-2
    [&_.meal-catalog-list]:grid-cols-1 md:[&_.meal-catalog-list]:grid-cols-2 xl:[&_.meal-catalog-list]:grid-cols-3
    [&_.meal-catalog-card]:rounded-2xl [&_.meal-catalog-card]:border-solid [&_.meal-catalog-card]:border-stone-200/80 [&_.meal-catalog-card]:bg-white
    [&_.settings-actions]:flex-wrap [&_.settings-actions_.btn]:w-full sm:[&_.settings-actions_.btn]:w-auto
    [&_.settings-panel-title]:items-center [&_.settings-panel-title]:justify-start [&_.settings-panel-title>div]:min-w-0
    [&_.settings-panel-title_h2]:leading-tight [&_.settings-panel-title_p]:leading-snug
    [&_.settings-section-grid]:grid-cols-1 lg:[&_.settings-section-grid]:grid-cols-2
    [&_.settings-premium-toolbar]:flex [&_.settings-premium-toolbar]:flex-col [&_.settings-premium-toolbar]:gap-3 [&_.settings-premium-toolbar]:rounded-2xl [&_.settings-premium-toolbar]:border [&_.settings-premium-toolbar]:border-stone-200/80 [&_.settings-premium-toolbar]:bg-[#fffefa] [&_.settings-premium-toolbar]:p-4 sm:[&_.settings-premium-toolbar]:flex-row sm:[&_.settings-premium-toolbar]:items-center sm:[&_.settings-premium-toolbar]:justify-between
    [&_.settings-count-pill]:inline-flex [&_.settings-count-pill]:w-max [&_.settings-count-pill]:items-center [&_.settings-count-pill]:rounded-full [&_.settings-count-pill]:border [&_.settings-count-pill]:border-orange-200 [&_.settings-count-pill]:bg-orange-50 [&_.settings-count-pill]:px-3 [&_.settings-count-pill]:py-1 [&_.settings-count-pill]:text-[10px] [&_.settings-count-pill]:font-black [&_.settings-count-pill]:uppercase [&_.settings-count-pill]:tracking-[.1em] [&_.settings-count-pill]:text-orange-700
    [&_.user-list]:grid [&_.user-list]:gap-2
    [&_.user-row]:grid [&_.user-row]:gap-3 [&_.user-row]:rounded-2xl [&_.user-row]:border [&_.user-row]:border-stone-200/80 [&_.user-row]:bg-white [&_.user-row]:p-3 [&_.user-row]:shadow-sm sm:[&_.user-row]:grid-cols-[44px_minmax(0,1fr)_auto] sm:[&_.user-row]:items-center
    [&_.user-avatar]:grid [&_.user-avatar]:h-11 [&_.user-avatar]:w-11 [&_.user-avatar]:place-items-center [&_.user-avatar]:rounded-2xl [&_.user-avatar]:bg-stone-950 [&_.user-avatar]:text-sm [&_.user-avatar]:font-black [&_.user-avatar]:text-white
    [&_.user-row-title]:min-w-0 [&_.user-row-title_strong]:block [&_.user-row-title_strong]:truncate [&_.user-row-title_strong]:text-sm [&_.user-row-title_strong]:font-black [&_.user-row-title_p]:mt-1 [&_.user-row-title_p]:truncate [&_.user-row-title_p]:text-xs [&_.user-row-title_p]:font-bold [&_.user-row-title_p]:text-stone-500
    [&_.user-row-meta]:flex [&_.user-row-meta]:flex-wrap [&_.user-row-meta]:gap-1.5 sm:[&_.user-row-meta]:justify-end
    [&_.role-chip]:inline-flex [&_.role-chip]:items-center [&_.role-chip]:rounded-full [&_.role-chip]:border [&_.role-chip]:border-stone-200 [&_.role-chip]:bg-stone-50 [&_.role-chip]:px-2.5 [&_.role-chip]:py-1 [&_.role-chip]:text-[10px] [&_.role-chip]:font-black [&_.role-chip]:uppercase [&_.role-chip]:tracking-[.08em] [&_.role-chip]:text-stone-600
    [&_.settings-modal-backdrop]:fixed [&_.settings-modal-backdrop]:inset-0 [&_.settings-modal-backdrop]:z-50 [&_.settings-modal-backdrop]:grid [&_.settings-modal-backdrop]:place-items-end [&_.settings-modal-backdrop]:bg-stone-950/45 [&_.settings-modal-backdrop]:p-0 [&_.settings-modal-backdrop]:backdrop-blur-sm sm:[&_.settings-modal-backdrop]:place-items-center sm:[&_.settings-modal-backdrop]:p-4
    [&_.settings-modal-panel]:max-h-[92vh] [&_.settings-modal-panel]:w-full [&_.settings-modal-panel]:max-w-2xl [&_.settings-modal-panel]:overflow-auto [&_.settings-modal-panel]:rounded-t-[28px] [&_.settings-modal-panel]:border [&_.settings-modal-panel]:border-white/70 [&_.settings-modal-panel]:bg-white [&_.settings-modal-panel]:p-5 [&_.settings-modal-panel]:shadow-2xl sm:[&_.settings-modal-panel]:rounded-[28px]
    [&_.settings-modal-header]:mb-4 [&_.settings-modal-header]:flex [&_.settings-modal-header]:items-start [&_.settings-modal-header]:justify-between [&_.settings-modal-header]:gap-3 [&_.settings-modal-header]:border-b [&_.settings-modal-header]:border-stone-100 [&_.settings-modal-header]:pb-3
    [&_.settings-modal-close]:grid [&_.settings-modal-close]:h-9 [&_.settings-modal-close]:w-9 [&_.settings-modal-close]:place-items-center [&_.settings-modal-close]:rounded-full [&_.settings-modal-close]:border [&_.settings-modal-close]:border-stone-200 [&_.settings-modal-close]:bg-white [&_.settings-modal-close]:text-lg [&_.settings-modal-close]:font-black [&_.settings-modal-close]:text-stone-500
    [&_.settings-error-card]:rounded-xl [&_.settings-error-card]:border [&_.settings-error-card]:border-red-200 [&_.settings-error-card]:bg-red-50 [&_.settings-error-card]:px-4 [&_.settings-error-card]:py-3 [&_.settings-error-card]:text-sm [&_.settings-error-card]:font-bold [&_.settings-error-card]:text-red-700
    [&_.supplier-grid]:grid [&_.supplier-grid]:grid-cols-1 [&_.supplier-grid]:gap-3 xl:[&_.supplier-grid]:grid-cols-2
    [&_.supplier-card]:grid [&_.supplier-card]:gap-3 [&_.supplier-card]:rounded-[22px] [&_.supplier-card]:border [&_.supplier-card]:border-stone-200/80 [&_.supplier-card]:bg-white [&_.supplier-card]:p-4 [&_.supplier-card]:shadow-[0_16px_34px_rgba(25,27,24,.07)]
    [&_.supplier-card-head]:grid [&_.supplier-card-head]:grid-cols-[44px_minmax(0,1fr)_auto] [&_.supplier-card-head]:items-start [&_.supplier-card-head]:gap-3
    [&_.supplier-icon]:grid [&_.supplier-icon]:h-11 [&_.supplier-icon]:w-11 [&_.supplier-icon]:place-items-center [&_.supplier-icon]:rounded-2xl [&_.supplier-icon]:bg-stone-950 [&_.supplier-icon]:text-white
    [&_.supplier-title]:min-w-0 [&_.supplier-title_strong]:block [&_.supplier-title_strong]:truncate [&_.supplier-title_strong]:text-base [&_.supplier-title_strong]:font-black [&_.supplier-title_p]:mt-1 [&_.supplier-title_p]:line-clamp-2 [&_.supplier-title_p]:text-xs [&_.supplier-title_p]:font-bold [&_.supplier-title_p]:text-stone-500
    [&_.supplier-info-grid]:grid [&_.supplier-info-grid]:grid-cols-1 [&_.supplier-info-grid]:gap-2 md:[&_.supplier-info-grid]:grid-cols-2 2xl:[&_.supplier-info-grid]:grid-cols-3
    [&_.supplier-info-grid>span]:min-w-0 [&_.supplier-info-grid>span]:rounded-xl [&_.supplier-info-grid>span]:border [&_.supplier-info-grid>span]:border-stone-200 [&_.supplier-info-grid>span]:bg-stone-50 [&_.supplier-info-grid>span]:p-2 [&_.supplier-info-grid_small]:block [&_.supplier-info-grid_small]:text-[9px] [&_.supplier-info-grid_small]:font-black [&_.supplier-info-grid_small]:uppercase [&_.supplier-info-grid_small]:tracking-[.08em] [&_.supplier-info-grid_small]:text-stone-400 [&_.supplier-info-grid_b]:mt-0.5 [&_.supplier-info-grid_b]:block [&_.supplier-info-grid_b]:whitespace-normal [&_.supplier-info-grid_b]:break-words [&_.supplier-info-grid_b]:text-xs [&_.supplier-info-grid_b]:font-black [&_.supplier-info-grid_b]:leading-snug [&_.supplier-info-grid_b]:text-stone-800
    [&_.supplier-meal-picker]:grid [&_.supplier-meal-picker]:grid-cols-1 [&_.supplier-meal-picker]:gap-2 sm:[&_.supplier-meal-picker]:grid-cols-2
    [&_.supplier-meal-option]:grid [&_.supplier-meal-option]:grid-cols-[40px_minmax(0,1fr)] [&_.supplier-meal-option]:items-start [&_.supplier-meal-option]:gap-2 [&_.supplier-meal-option]:rounded-xl [&_.supplier-meal-option]:border [&_.supplier-meal-option]:border-stone-200 [&_.supplier-meal-option]:bg-stone-50/70 [&_.supplier-meal-option]:p-3 [&_.supplier-meal-option_strong]:block [&_.supplier-meal-option_strong]:text-xs [&_.supplier-meal-option_strong]:font-black [&_.supplier-meal-option_small]:mt-0.5 [&_.supplier-meal-option_small]:block [&_.supplier-meal-option_small]:text-[10px] [&_.supplier-meal-option_small]:font-bold [&_.supplier-meal-option_small]:text-stone-500
    [&_.supplier-create-meals]:grid [&_.supplier-create-meals]:gap-2 [&_.supplier-create-meals]:rounded-2xl [&_.supplier-create-meals]:border [&_.supplier-create-meals]:border-orange-200 [&_.supplier-create-meals]:bg-orange-50/40 [&_.supplier-create-meals]:p-3 [&_.supplier-create-meals>label]:text-[10px] [&_.supplier-create-meals>label]:font-black [&_.supplier-create-meals>label]:uppercase [&_.supplier-create-meals>label]:tracking-[.1em] [&_.supplier-create-meals>label]:text-orange-700
    [&_.supplier-new-meal-row]:grid [&_.supplier-new-meal-row]:gap-2 lg:[&_.supplier-new-meal-row]:grid-cols-[minmax(0,1.1fr)_130px_110px_minmax(0,1fr)]
    [&_.link-supplier-list]:grid [&_.link-supplier-list]:gap-3
    [&_.link-supplier-card]:rounded-[22px] [&_.link-supplier-card]:border [&_.link-supplier-card]:border-stone-200/80 [&_.link-supplier-card]:bg-white [&_.link-supplier-card]:p-4 [&_.link-supplier-card]:shadow-sm
    [&_.link-supplier-head]:mb-3 [&_.link-supplier-head]:flex [&_.link-supplier-head]:items-start [&_.link-supplier-head]:justify-between [&_.link-supplier-head]:gap-3 [&_.link-supplier-head_strong]:block [&_.link-supplier-head_strong]:text-base [&_.link-supplier-head_strong]:font-black [&_.link-supplier-head_p]:mt-1 [&_.link-supplier-head_p]:text-xs [&_.link-supplier-head_p]:font-bold [&_.link-supplier-head_p]:text-stone-500
    [&_.meal-link-grid]:grid [&_.meal-link-grid]:grid-cols-1 [&_.meal-link-grid]:gap-2 md:[&_.meal-link-grid]:grid-cols-2 xl:[&_.meal-link-grid]:grid-cols-3
    [&_.meal-link-card]:grid [&_.meal-link-card]:gap-2 [&_.meal-link-card]:rounded-2xl [&_.meal-link-card]:border [&_.meal-link-card]:border-stone-200 [&_.meal-link-card]:bg-[#fffefa] [&_.meal-link-card]:p-3
    [&_.meal-link-card-head]:flex [&_.meal-link-card-head]:items-start [&_.meal-link-card-head]:justify-between [&_.meal-link-card-head]:gap-2 [&_.meal-link-card-head_strong]:block [&_.meal-link-card-head_strong]:text-sm [&_.meal-link-card-head_strong]:font-black [&_.meal-link-card-head_small]:mt-1 [&_.meal-link-card-head_small]:block [&_.meal-link-card-head_small]:text-xs [&_.meal-link-card-head_small]:font-bold [&_.meal-link-card-head_small]:text-stone-500
    [&_.work-section-list]:grid-cols-1 md:[&_.work-section-list]:grid-cols-2 xl:[&_.work-section-list]:grid-cols-3
    [&_.work-section-card]:rounded-[22px] [&_.work-section-card]:border-solid [&_.work-section-card]:bg-white [&_.work-section-card]:p-4 [&_.work-section-card]:shadow-[0_12px_28px_rgba(25,27,24,.06)] [&_.work-section-card_strong]:whitespace-normal [&_.work-section-card_strong]:break-words [&_.work-section-card_small]:leading-snug [&_.work-section-card_.supplier-info-grid]:grid-cols-1
    [&_.meal-catalog-card]:p-4 [&_.meal-catalog-list]:gap-3
  `;

  const areaTypeLabel = (value) => ({
    campo: "Campo",
    canteiro: "Canteiro",
    escritorio: "Escritorio",
    misto: "Misto"
  }[value] ?? "Campo");

  function renderConfiguracoes() {
    const state = getState();
    const user = state.users.find((item) => item.id === (state.activeUserId ?? state.authenticatedUserId));
    if (!user) return renderEmptyState("Sessao expirada", "Entre novamente para alterar suas configuracoes.");
    const canManageCatalog = user.role === "admin" || user.role === "fornecedor";
    const isLeader = user.role === "encarregado";
    const isAdmin = user.role === "admin";
    const activeSuppliers = (state.supplierCompanies ?? []).filter((item) => item.active !== false).length;
    const activeMeals = (state.mealCatalog ?? []).filter((item) => item.active !== false).length;
    const activeSections = (state.workSections ?? []).filter((item) => item.active !== false).length;
    const activeUsers = (state.users ?? []).filter((item) => item.active !== false).length;
    const navItems = [
      ...(isAdmin ? [["resumo", "dashboard", "Resumo"]] : []),
      ["conta", "users", "Conta"],
      ...(isAdmin ? [
        ["convites", "plus", "Convites"],
        ["usuarios", "users", "Usuarios"],
        ["fornecedores", "package", "Fornecedores"],
        ["vinculos", "utensils", "Vinculos"],
        ["efetivos", "map", "Efetivos"],
        ["refeicoes", "utensils", "Refeicoes"]
      ] : canManageCatalog && !isLeader ? [["refeicoes", "utensils", "Refeicoes"]] : [])
    ];
    const currentTab = getSettingsActiveTab?.() ?? "resumo";
    const activeTab = navItems.some(([id]) => id === currentTab) ? currentTab : navItems[0][0];
    const section = {
      resumo: ["Resumo", "Indicadores rapidos da estrutura administrativa.", renderOverviewPanel(activeUsers, activeSuppliers, activeMeals, activeSections)],
      conta: ["Conta", "E-mail, dados pessoais e seguranca da conta.", `${renderProfilePanel(user)}${renderPasswordPanel()}`],
      convites: ["Convites", "Links privados para liberar novos acessos.", renderAccessInvitePanel()],
      usuarios: ["Usuarios", "Cadastro direto de usuarios e perfis internos.", renderAdminUsersPanel()],
      fornecedores: ["Fornecedores", "Empresas e restaurantes usados nas operacoes.", renderSupplierCompaniesPanel()],
      vinculos: ["Vinculos", "Regras de atendimento e preco por fornecedor.", renderSupplierMealLinksPanel()],
      efetivos: ["Efetivos", "Equipes, trechos, area e encarregado responsavel.", renderWorkSectionsPanel()],
      refeicoes: ["Refeicoes", "Tipos de alimentacao, composicao, categoria e preco.", renderMealCatalogPanel(user)]
    }[activeTab];

    return `
      <section class="${settingsPageClass}">
        <div class="settings-back-row">${renderAdminBackButton()}</div>
        <div class="settings-shell">
          ${renderSettingsNav(navItems, activeTab)}
          <div class="settings-content">
            <header class="settings-header">
              <div class="settings-header-main">
                <div class="settings-header-copy">
                  <span class="settings-header-icon">${icon("settings", 22)}</span>
                  <div>
                    <span class="compact-kicker">Configuracoes</span>
                    <h1>${isAdmin ? "Central administrativa" : isLeader ? "Minha conta" : canManageCatalog ? "Conta e catalogo" : "Minha conta"}</h1>
                    <p>${isAdmin ? "Organize acessos, fornecedores, refeicoes e efetivos em um unico painel." : isLeader ? "Atualize seus dados de usuario e senha." : canManageCatalog ? "Mantenha dados de acesso, equipes e tipos de alimentacao." : "Atualize seus dados de acesso e as informacoes que aparecem no sistema."}</p>
                  </div>
                </div>
                <span class="settings-header-badge">${roleName(user.role)}</span>
              </div>
            </header>
            <div class="settings-layout">
              <section class="settings-section" data-settings-panel="${activeTab}">
                <div class="settings-section-head"><div><h2>${section[0]}</h2><p>${section[1]}</p></div></div>
                <div class="settings-section-grid">${section[2]}</div>
              </section>
            </div>
          </div>
        </div>
        ${renderSettingsModals(user)}
      </section>`;
  }

  function renderSettingsNav(items, activeTab) {
    return `
      <aside class="settings-nav-column">
        <div class="settings-nav-card">
          <div class="settings-nav-title"><span>Menu de gestao</span></div>
          <nav class="settings-menu" aria-label="Atalhos de configuracao">
            ${items.map(([id, iconName, label]) => `<button class="${id === activeTab ? "is-active" : ""}" type="button" data-settings-tab="${id}">${icon(iconName, 15)}${label}<i class="settings-menu-dot"></i></button>`).join("")}
          </nav>
        </div>
      </aside>`;
  }

  function renderOverviewPanel(activeUsers, activeSuppliers, activeMeals, activeSections) {
    return `
      <section class="settings-panel settings-panel-wide">
        <div class="settings-panel-title">
          <span>${icon("dashboard", 18)}</span>
          <div><h2>Visao geral</h2><p>Resumo rapido dos cadastros que sustentam a operacao.</p></div>
        </div>
        <div class="settings-overview">
          ${renderSettingStat("Usuarios", activeUsers, "Acessos ativos", "users")}
          ${renderSettingStat("Fornecedores", activeSuppliers, "Empresas ativas", "package")}
          ${renderSettingStat("Refeicoes", activeMeals, "Tipos ativos", "utensils")}
          ${renderSettingStat("Efetivos", activeSections, "Locais ativos", "map")}
        </div>
      </section>`;
  }

  function renderSettingStat(label, value, caption, iconName) {
    return `<article class="settings-stat"><span class="settings-stat-icon">${icon(iconName, 18)}</span><div><strong>${value}</strong><span>${caption || label}</span></div></article>`;
  }

  function renderProfilePanel(user) {
    return `
      <form class="settings-panel" data-form="profile-settings">
        <div class="settings-panel-title">
          <span>${icon("users", 18)}</span>
          <div><h2>Dados do usuario</h2><p>Essas informacoes identificam voce nos pedidos e registros.</p></div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="settings-name">Nome</label>
            <input id="settings-name" name="name" value="${escapeHtml(user.name)}" required />
          </div>
          <div class="field">
            <label for="settings-team">Equipe / frente</label>
            <input id="settings-team" name="team" value="${escapeHtml(user.team || "")}" placeholder="Ex.: Frente Norte" />
          </div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label>E-mail</label>
            <input value="${escapeHtml(user.email)}" disabled />
          </div>
          <div class="field">
            <label>Perfil</label>
            <input value="${roleName(user.role)}" disabled />
          </div>
        </div>
        <footer class="settings-actions">
          <button class="btn primary" type="submit">Salvar dados</button>
        </footer>
      </form>`;
  }

  function renderPasswordPanel() {
    return `
      <form class="settings-panel" data-form="password-settings">
        <div class="settings-panel-title">
          <span>${icon("settings", 18)}</span>
          <div><h2>Senha</h2><p>Use pelo menos 8 caracteres para proteger sua conta.</p></div>
        </div>
        <div class="field">
          <label for="settings-password">Nova senha</label>
          <input id="settings-password" name="password" type="password" minlength="8" autocomplete="new-password" required />
        </div>
        <div class="field">
          <label for="settings-password-confirm">Confirmar nova senha</label>
          <input id="settings-password-confirm" name="passwordConfirm" type="password" minlength="8" autocomplete="new-password" required />
        </div>
        <footer class="settings-actions">
          <button class="btn outline" type="submit">Alterar senha</button>
        </footer>
      </form>`;
  }

  function renderAdminUsersPanel() {
    const state = getState();
    const supplierCompanies = state.supplierCompanies ?? [];
    const supplierUsers = state.users.filter((item) => item.role === "fornecedor");
    const users = [...(state.users ?? [])].sort((a, b) => roleName(a.role).localeCompare(roleName(b.role)) || String(a.name ?? "").localeCompare(String(b.name ?? "")));
    return `
      <section class="settings-panel settings-panel-wide">
        <div class="settings-panel-title">
          <span>${icon("users", 18)}</span>
          <div><h2>Usuarios</h2><p>Acessos internos em uma lista limpa; a criacao fica no modal.</p></div>
        </div>
        <div class="settings-premium-toolbar">
          <div>
            <span class="settings-count-pill">${users.length} acessos</span>
            <p class="mt-2">Consulte status, perfil e vinculo sem abrir um formulario gigante.</p>
          </div>
          <button class="btn primary" type="button" data-open-admin-user-modal>${icon("plus", 15)}Novo usuario</button>
        </div>
        <div class="user-list">
          ${users.map((user) => renderUserRow(user, supplierCompanies)).join("") || `<div class="empty">Nenhum usuario cadastrado.</div>`}
        </div>
        ${supplierUsers.length && supplierCompanies.length ? `
          <details class="meal-catalog-edit">
            <summary>${icon("package", 14)}Vincular login de fornecedor</summary>
            <form class="meal-catalog-item" data-form="supplier-company-user">
              <div class="form-grid">
                <div class="field"><label for="supplier-link-user">Login fornecedor</label><select id="supplier-link-user" name="userId">${supplierUsers.map((user) => `<option value="${user.id}">${escapeHtml(user.name)} - ${escapeHtml(user.email)}</option>`).join("")}</select></div>
                <div class="field"><label for="supplier-link-company">Empresa fornecedora</label><select id="supplier-link-company" name="supplierCompanyId">${supplierCompanies.map((supplier) => `<option value="${supplier.id}">${escapeHtml(supplier.tradeName || supplier.legalName)}</option>`).join("")}</select></div>
              </div>
              <div class="form-grid"><div class="field"><label for="supplier-link-active">Status</label><select id="supplier-link-active" name="active"><option value="true">Ativo</option><option value="false">Inativo</option></select></div></div>
              <footer class="settings-actions"><button class="btn outline" type="submit">Vincular login</button></footer>
            </form>
          </details>` : ""}
        ${getSettingsUserModalOpen?.() ? renderAdminUserModal(supplierCompanies) : ""}
      </section>`;
  }

  function renderUserRow(user, supplierCompanies) {
    const initials = String(user.name ?? user.email ?? "?").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    const supplierLink = (getState().supplierCompanyUsers ?? []).find((item) => item.userId === user.id && item.active !== false);
    const supplier = supplierCompanies.find((item) => item.id === supplierLink?.supplierCompanyId);
    return `
      <article class="user-row">
        <span class="user-avatar">${escapeHtml(initials || "?")}</span>
        <div class="user-row-title">
          <strong>${escapeHtml(user.name)}</strong>
          <p>${escapeHtml(user.email)}${user.team ? ` - ${escapeHtml(user.team)}` : ""}${supplier ? ` - ${escapeHtml(supplier.tradeName || supplier.legalName)}` : ""}</p>
        </div>
        <div class="user-row-meta">
          <span class="role-chip">${roleName(user.role)}</span>
          <span class="meal-status-chip ${user.active !== false ? "active" : "inactive"}">${user.active !== false ? "Ativo" : "Inativo"}</span>
        </div>
      </article>`;
  }

  function renderAdminUserModal(supplierCompanies) {
    const error = getSettingsUserModalError?.();
    return `
      <div class="settings-modal-backdrop" data-close-admin-user-modal>
        <section class="settings-modal-panel" role="dialog" aria-modal="true" aria-labelledby="admin-user-title" onclick="event.stopPropagation()">
          <header class="settings-modal-header">
            <div>
              <span class="compact-kicker">Novo acesso</span>
              <h2 id="admin-user-title">Criar usuario</h2>
              <p>Defina login, senha inicial, perfil e vinculo operacional.</p>
            </div>
            <button class="settings-modal-close" type="button" data-close-admin-user-modal aria-label="Fechar">x</button>
          </header>
          <form class="grid gap-3" data-form="admin-user">
            ${error ? `<div class="settings-error-card">${escapeHtml(error)}</div>` : ""}
            <div class="form-grid">
              <div class="field"><label for="admin-user-name">Nome</label><input id="admin-user-name" name="name" required /></div>
              <div class="field"><label for="admin-user-email">Login / e-mail</label><input id="admin-user-email" name="email" type="email" required /></div>
            </div>
            <div class="form-grid">
              <div class="field"><label for="admin-user-password">Senha inicial</label><input id="admin-user-password" name="password" type="password" minlength="8" required /></div>
              <div class="field"><label for="admin-user-role">Perfil</label><select id="admin-user-role" name="role"><option value="encarregado">Encarregado</option><option value="admin">Administrador</option><option value="fornecedor">Fornecedor</option></select></div>
            </div>
            <div class="form-grid">
              <div class="field"><label for="admin-user-team">Equipe / empresa</label><input id="admin-user-team" name="team" placeholder="Ex.: Frente Norte ou Restaurante Central" /></div>
              <div class="field"><label for="admin-user-supplier">Fornecedor vinculado</label><select id="admin-user-supplier" name="supplierCompanyId"><option value="">Sem vinculo</option>${supplierCompanies.map((supplier) => `<option value="${supplier.id}">${escapeHtml(supplier.tradeName || supplier.legalName)}</option>`).join("")}</select></div>
            </div>
            <div class="form-grid">
              <div class="field"><label for="admin-user-active">Status</label><select id="admin-user-active" name="active"><option value="true">Ativo</option><option value="false">Inativo</option></select></div>
            </div>
            <footer class="settings-actions">
              <button class="btn outline" type="button" data-close-admin-user-modal>Cancelar</button>
              <button class="btn primary" type="submit">${icon("plus", 15)}Criar usuario</button>
            </footer>
          </form>
        </section>
      </div>`;
  }

  function renderSupplierCompaniesPanel() {
    const state = getState();
    const suppliers = state.supplierCompanies ?? [];
    return `
      <section class="settings-panel settings-panel-wide">
        <div class="settings-panel-title">
          <span>${icon("package", 18)}</span>
          <div><h2>Fornecedores / restaurantes</h2><p>Cadastro empresarial usado nos pedidos, medicao, KPI e historico.</p></div>
        </div>
        <div class="settings-premium-toolbar">
          <div>
            <span class="settings-count-pill">${suppliers.length} fornecedores</span>
            <p class="mt-2">Dados formais, contato e status em cards mais faceis de escanear.</p>
          </div>
          <button class="btn primary" type="button" data-open-supplier-modal="new">${icon("plus", 15)}Novo fornecedor</button>
        </div>
        <div class="supplier-grid">
          ${suppliers.map(renderSupplierCompanyCard).join("") || `<div class="empty">Nenhum fornecedor empresarial cadastrado.</div>`}
        </div>
      </section>`;
  }

  function renderSupplierCompanyCard(supplier) {
    const state = getState();
    const title = supplier.tradeName || supplier.legalName || "Fornecedor";
    const location = [supplier.addressLine, supplier.city, supplier.state].filter(Boolean).join(" - ") || "Sem endereco informado.";
    const linkedMeals = (state.supplierMealTypes ?? []).filter((item) => item.supplierCompanyId === supplier.id && item.active === true);
    const mealCountLabel = linkedMeals.length === 1 ? "1 refeicao vinculada" : `${linkedMeals.length} refeicoes vinculadas`;
    return `
      <article class="supplier-card">
        <div class="supplier-card-head">
          <span class="supplier-icon">${icon("package", 18)}</span>
          <div class="supplier-title">
            <strong>${escapeHtml(title)}</strong>
            <p>${escapeHtml(supplier.legalName || title)}${supplier.cnpj ? ` - CNPJ ${escapeHtml(supplier.cnpj)}` : ""}</p>
          </div>
          <span class="meal-status-chip ${supplier.active ? "active" : "inactive"}">${supplier.active ? "Ativo" : "Inativo"}</span>
        </div>
        <div class="supplier-info-grid">
          <span><small>Refeicoes</small><b>${mealCountLabel}</b></span>
          <span><small>Cidade</small><b>${escapeHtml([supplier.city, supplier.state].filter(Boolean).join(" / ") || "Nao informado")}</b></span>
          <span><small>Contato</small><b>${escapeHtml(supplier.contactName || supplier.phone || "Nao informado")}</b></span>
          <span><small>E-mail</small><b>${escapeHtml(supplier.email || "Nao informado")}</b></span>
        </div>
        <p class="text-xs font-bold text-stone-500">${escapeHtml(location)}</p>
        <button class="btn outline small" type="button" data-open-supplier-modal="${supplier.id}">${icon("edit", 14)}Editar cadastro</button>
      </article>`;
  }

  function renderSupplierCompanyForm(supplier) {
    const state = getState();
    const links = state.supplierMealTypes ?? [];
    const linkedMeals = links
      .filter((item) => item.supplierCompanyId === supplier.id && item.active === true)
      .map((link) => ({
        link,
        meal: state.mealCatalog?.find((meal) => meal.id === link.mealTypeId)
      }))
      .filter((item) => item.meal);
    return `
      <form class="meal-catalog-new-form" data-form="supplier-company">
        <input type="hidden" name="id" value="${supplier.id ?? ""}" />
        <div class="form-grid"><div class="field"><label>Razao social</label><input name="legalName" value="${escapeHtml(supplier.legalName ?? "")}" required /></div><div class="field"><label>Nome fantasia</label><input name="tradeName" value="${escapeHtml(supplier.tradeName ?? "")}" /></div></div>
        <div class="form-grid"><div class="field"><label>CNPJ</label><input name="cnpj" value="${escapeHtml(supplier.cnpj ?? "")}" /></div><div class="field"><label>Responsavel</label><input name="contactName" value="${escapeHtml(supplier.contactName ?? "")}" /></div></div>
        <div class="form-grid"><div class="field"><label>Inscricao estadual</label><input name="stateRegistration" value="${escapeHtml(supplier.stateRegistration ?? "")}" /></div><div class="field"><label>Inscricao municipal</label><input name="municipalRegistration" value="${escapeHtml(supplier.municipalRegistration ?? "")}" /></div></div>
        <div class="field"><label>Endereco completo</label><input name="addressLine" value="${escapeHtml(supplier.addressLine ?? "")}" /></div>
        <div class="form-grid"><div class="field"><label>Cidade</label><input name="city" value="${escapeHtml(supplier.city ?? "")}" /></div><div class="field"><label>Estado</label><input name="state" maxlength="2" value="${escapeHtml(supplier.state ?? "")}" /></div></div>
        <div class="form-grid"><div class="field"><label>CEP</label><input name="zipCode" value="${escapeHtml(supplier.zipCode ?? "")}" /></div><div class="field"><label>Telefone</label><input name="phone" value="${escapeHtml(supplier.phone ?? "")}" /></div></div>
        <div class="form-grid"><div class="field"><label>E-mail</label><input name="email" type="email" value="${escapeHtml(supplier.email ?? "")}" /></div><div class="field"><label>Status</label><select name="active"><option value="true" ${supplier.active === false ? "" : "selected"}>Ativo</option><option value="false" ${supplier.active === false ? "selected" : ""}>Inativo</option></select></div></div>
        <div class="field">
          <label>Refeicoes deste fornecedor</label>
          ${linkedMeals.length ? `<div class="supplier-meal-picker">${linkedMeals.map(({ meal, link }) => `
            <div class="supplier-meal-option">
              <span class="settings-stat-icon">${icon("utensils", 15)}</span>
              <span><strong>${escapeHtml(meal.label)}</strong><small>${mealCategoryLabel(meal.category)} - ${money(link.unitPrice ?? meal.unitPrice)}</small></span>
            </div>`).join("")}</div>` : `<div class="empty">Este fornecedor ainda nao tem refeicoes vinculadas.</div>`}
        </div>
        <div class="supplier-create-meals">
          <label>Criar refeicoes junto com o fornecedor</label>
          ${[0, 1, 2].map((index) => `
            <div class="supplier-new-meal-row">
              <input name="newMealName" placeholder="Nome da refeicao" />
              <select name="newMealCategory">
                <option value="marmita">Marmita</option>
                <option value="buffet">Buffet</option>
                <option value="janta">Janta</option>
                <option value="outro">Outro</option>
              </select>
              <input name="newMealUnitPrice" type="number" min="0" step="0.01" placeholder="Preco" />
              <input name="newMealDescription" placeholder="Composicao / observacao" />
            </div>`).join("")}
        </div>
        <div class="field"><label>Dados bancarios</label><textarea name="bankDetails">${escapeHtml(supplier.bankDetails ?? "")}</textarea></div>
        <div class="field"><label>Observacoes internas</label><textarea name="notes">${escapeHtml(supplier.notes ?? "")}</textarea></div>
        <footer class="settings-actions"><button class="btn ${supplier.id ? "outline" : "primary"}" type="submit">${supplier.id ? "Salvar" : "Cadastrar fornecedor"}</button></footer>
      </form>`;
  }

  function renderSupplierMealLinksPanel() {
    const state = getState();
    const suppliers = state.supplierCompanies ?? [];
    const meals = state.mealCatalog ?? [];
    if (!suppliers.length || !meals.length) {
      return `
        <section class="settings-panel settings-panel-wide">
          <div class="settings-panel-title">
            <span>${icon("utensils", 18)}</span>
            <div><h2>Refeicoes por fornecedor</h2><p>Controle quais fornecedores aparecem para cada tipo de pedido.</p></div>
          </div>
          <div class="empty">Cadastre ao menos um fornecedor e uma refeicao para configurar vinculos.</div>
        </section>`;
    }
    return `
      <section class="settings-panel settings-panel-wide">
        <div class="settings-panel-title">
          <span>${icon("utensils", 18)}</span>
          <div><h2>Refeicoes por fornecedor</h2><p>Controle quais fornecedores aparecem para cada tipo de pedido.</p></div>
        </div>
        <div class="settings-premium-toolbar">
          <div>
            <span class="settings-count-pill">${suppliers.length} fornecedores x ${meals.length} refeicoes</span>
            <p class="mt-2">Cada bloco mostra rapidamente o que o fornecedor atende e o preco registrado.</p>
          </div>
        </div>
        <div class="link-supplier-list">
          ${suppliers.map((supplier) => `
            <article class="link-supplier-card">
              <div class="link-supplier-head">
                <div><strong>${escapeHtml(supplier.tradeName || supplier.legalName)}</strong><p>${supplier.active ? "Disponivel para novos pedidos" : "Inativo: fica apenas no historico"}</p></div>
                <span class="meal-status-chip ${supplier.active ? "active" : "inactive"}">${supplier.active ? "Ativo" : "Inativo"}</span>
              </div>
              <div class="meal-link-grid">
              ${meals.filter((meal) => state.supplierMealTypes?.some((item) => item.supplierCompanyId === supplier.id && item.mealTypeId === meal.id)).map((meal) => {
                const link = state.supplierMealTypes?.find((item) => item.supplierCompanyId === supplier.id && item.mealTypeId === meal.id);
                const active = supplier.active !== false && link?.active === true;
                const disabled = supplier.active === false ? "disabled" : "";
                return `<form class="meal-link-card" data-form="supplier-meal-link"><input type="hidden" name="supplierCompanyId" value="${supplier.id}" /><input type="hidden" name="mealTypeId" value="${meal.id}" />${supplier.active === false ? `<input type="hidden" name="active" value="false" />` : ""}<div class="meal-link-card-head"><div><strong>${escapeHtml(meal.label)}</strong><small>${mealCategoryLabel(meal.category)}</small></div><span class="meal-status-chip ${active ? "active" : "inactive"}">${active ? "Ativo" : "Inativo"}</span></div><div class="form-grid"><div class="field"><label>Status</label><select name="active" ${disabled}><option value="true" ${active ? "selected" : ""}>Ativo</option><option value="false" ${active ? "" : "selected"}>Inativo</option></select></div><div class="field"><label>Preco</label><input name="unitPrice" type="number" min="0" step="0.01" value="${link?.unitPrice ?? ""}" placeholder="${money(meal.unitPrice)}" ${disabled} /></div></div><footer class="settings-actions"><button class="btn outline small" type="submit" ${disabled}>Salvar</button></footer></form>`;
              }).join("") || `<div class="empty">Nenhuma refeicao vinculada a este fornecedor.</div>`}
              </div>
            </article>`).join("")}
        </div>
      </section>`;
  }

  function renderAccessInvitePanel() {
    const generatedInviteLink = getGeneratedInviteLink();
    return `
      <form class="settings-panel settings-panel-wide access-invite-panel" data-form="access-invite">
        <div class="settings-panel-title">
          <span>${icon("users", 18)}</span>
          <div><h2>Convidar acesso interno</h2><p>Gere um link privado para criar fornecedor ou administrador.</p></div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="invite-role">Tipo de acesso</label>
            <select id="invite-role" name="role" required>
              <option value="fornecedor">Fornecedor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div class="field">
            <label for="invite-email">E-mail permitido <span class="optional-label">Opcional</span></label>
            <input id="invite-email" name="email" type="email" placeholder="pessoa@empresa.com" />
          </div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="invite-team">Equipe / empresa <span class="optional-label">Opcional</span></label>
            <input id="invite-team" name="team" placeholder="Ex.: Cozinha Central" />
          </div>
          <div class="field">
            <label for="invite-days">Validade</label>
            <select id="invite-days" name="expiresInDays">
              <option value="7">7 dias</option>
              <option value="15">15 dias</option>
              <option value="30">30 dias</option>
            </select>
          </div>
        </div>
        ${generatedInviteLink ? `<div class="invite-link-box"><span>Link gerado</span><strong>${escapeHtml(generatedInviteLink)}</strong><button class="btn outline small" type="button" data-copy-invite-link>Copiar link</button></div>` : ""}
        <footer class="settings-actions">
          <button class="btn primary" type="submit">${icon("plus", 15)}Gerar link privado</button>
        </footer>
      </form>`;
  }

  function renderWorkSectionsPanel() {
    const state = getState();
    const leaders = state.users.filter((item) => item.role === "encarregado" && item.active !== false);
    const sections = state.workSections ?? [];
    const activeCount = sections.filter((section) => section.active !== false).length;
    const totalHeadcount = sections.reduce((sum, section) => sum + Number(section.headcount ?? 0), 0);
    return `
      <section class="settings-panel work-section-panel">
        <div class="settings-panel-title">
          <span>${icon("users", 18)}</span>
          <div><h2>Equipes e trechos</h2><p>Cadastre apenas equipe, efetivo e encarregado vinculado.</p></div>
        </div>
        <div class="settings-premium-toolbar">
          <div class="flex flex-wrap gap-2">
            <span class="settings-count-pill">${activeCount} ativos</span>
            <span class="settings-count-pill">${totalHeadcount} pessoas</span>
          </div>
          <button class="btn primary" type="button" data-open-work-section-modal="new">${icon("plus", 15)}Novo efetivo</button>
        </div>
        <div class="work-section-list">
          ${sections.map((section) => renderWorkSectionItem(section, leaders)).join("") || `<div class="empty">Nenhuma equipe cadastrada.</div>`}
        </div>
      </section>`;
  }

  function renderWorkSectionItem(section, leaders) {
    const leader = leaders.find((item) => item.id === section.leaderId);
    return `
      <article class="work-section-card">
        <div class="work-section-card-head">
          <div>
            <strong>${escapeHtml(section.name)}</strong>
            <small class="block text-stone-500">${areaTypeLabel(section.areaType)}${leader ? ` - ${escapeHtml(leader.name)}` : " - sem encarregado fixo"}</small>
          </div>
          <span class="meal-status-chip ${section.active ? "active" : "inactive"}">${section.active ? "Ativo" : "Inativo"}</span>
        </div>
        <div class="supplier-info-grid">
          <span><small>Efetivo</small><b>${Number(section.headcount ?? 0)} pessoas</b></span>
          <span><small>Area</small><b>${areaTypeLabel(section.areaType)}</b></span>
          <span><small>Responsavel</small><b>${escapeHtml(leader?.name || "Sem fixo")}</b></span>
        </div>
        <button class="btn outline small" type="button" data-open-work-section-modal="${section.id}">${icon("edit", 14)}Editar</button>
      </article>`;
  }

  function renderWorkSectionForm(section, leaders) {
    const id = section?.id ?? "new";
    return `
      <form class="meal-catalog-new-form" data-form="work-section">
        <input type="hidden" name="id" value="${section?.id ?? ""}" />
        <div class="form-grid">
          <div class="field"><label for="work-section-name-${id}">Equipe/trecho</label><input id="work-section-name-${id}" name="name" value="${escapeHtml(section?.name ?? "")}" placeholder="Ex.: Frente Norte" required /></div>
          <div class="field"><label for="work-section-headcount-${id}">Efetivo</label><input id="work-section-headcount-${id}" name="headcount" type="number" min="0" value="${Number(section?.headcount ?? 0)}" required /></div>
        </div>
        <div class="form-grid">
          <div class="field"><label for="work-section-leader-${id}">Encarregado</label><select id="work-section-leader-${id}" name="leaderId"><option value="">Sem vinculo fixo</option>${leaders.map((leader) => `<option value="${leader.id}" ${leader.id === section?.leaderId ? "selected" : ""}>${escapeHtml(leader.name)}</option>`).join("")}</select></div>
          <div class="field"><label for="work-section-active-${id}">Status</label><select id="work-section-active-${id}" name="active"><option value="true" ${section?.active === false ? "" : "selected"}>Ativo</option><option value="false" ${section?.active === false ? "selected" : ""}>Inativo</option></select></div>
        </div>
        <div class="field"><label for="work-section-area-${id}">Area</label><select id="work-section-area-${id}" name="areaType"><option value="campo" ${section?.areaType === "campo" ? "selected" : ""}>Campo</option><option value="canteiro" ${section?.areaType === "canteiro" ? "selected" : ""}>Canteiro</option><option value="escritorio" ${section?.areaType === "escritorio" ? "selected" : ""}>Escritorio</option><option value="misto" ${section?.areaType === "misto" ? "selected" : ""}>Misto</option></select></div>
        <footer class="settings-actions">
          <button class="btn outline" type="button" data-close-work-section-modal>Cancelar</button>
          <button class="btn primary" type="submit">${section?.id ? "Salvar" : "Cadastrar"}</button>
        </footer>
      </form>`;
  }

  function renderMealCatalogPanel(user) {
    const state = getState();
    if (!["admin", "fornecedor"].includes(user.role)) return "";
    return `
      <section class="settings-panel meal-catalog-panel">
        <div class="settings-panel-title">
          <span>${icon("utensils", 18)}</span>
          <div><h2>Tipos de alimentacao</h2><p>${user.role === "fornecedor" ? "Cadastre o tipo e o que vem na marmita." : "Gerencie tipos e precos individuais."}</p></div>
        </div>
        <div class="meal-catalog-toolbar">
          <span class="settings-count-pill">${state.mealCatalog.length} tipos cadastrados</span>
          <button class="btn primary small" type="button" data-open-meal-modal="new">${icon("plus", 15)}Nova refeicao</button>
        </div>
        <div class="meal-catalog-list">
          ${state.mealCatalog.map(renderMealCatalogItem).join("") || `<div class="empty">Nenhum tipo cadastrado.</div>`}
        </div>
      </section>`;
  }

  function renderMealCatalogItem(meal) {
    const statusClass = meal.active ? "active" : "inactive";
    return `
      <article class="meal-catalog-card">
        <div class="meal-catalog-card-head">
          <div class="grid min-w-0 grid-cols-[40px_minmax(0,1fr)] gap-3">
            <span class="settings-stat-icon">${icon("utensils", 17)}</span>
            <div class="meal-catalog-card-title">
              <strong>${escapeHtml(meal.label)}</strong>
              <p>${escapeHtml(meal.description || "Sem composicao informada.")}</p>
            </div>
          </div>
          <div class="meal-catalog-card-actions">
            <button class="icon-btn" type="button" data-open-meal-modal="${meal.id}" aria-label="Editar ${escapeHtml(meal.label)}">${icon("edit", 15)}</button>
            <button class="icon-btn danger" type="button" data-delete-meal-type="${meal.id}" aria-label="Excluir ${escapeHtml(meal.label)}">${icon("trash", 15)}</button>
          </div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span class="meal-status-chip ${statusClass}">${meal.active ? "Ativo" : "Inativo"}</span>
          <span class="meal-price-chip">${money(meal.unitPrice)}</span>
          <span class="meal-price-chip">${mealCategoryLabel(meal.category)}</span>
        </div>
      </article>`;
  }

  function renderMealCatalogForm(meal = null) {
    const state = getState();
    const id = meal?.id ?? "new";
    return `
      <form class="meal-catalog-new-form" data-form="meal-catalog">
        <input type="hidden" name="id" value="${meal?.id ?? ""}" />
        <div class="form-grid">
          <div class="field">
            <label for="meal-name-${id}">Nome do tipo</label>
            <input id="meal-name-${id}" name="name" value="${escapeHtml(meal?.label ?? "")}" placeholder="Ex.: Marmita proteica" required />
          </div>
          <div class="field">
            <label for="meal-price-${id}">Preco unitario</label>
            <input id="meal-price-${id}" name="unitPrice" type="number" min="0" step="0.01" value="${Number(meal?.unitPrice ?? state.settings.defaultMealUnitPrice ?? 0)}" required />
          </div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="meal-active-${id}">Status</label>
            <select id="meal-active-${id}" name="active">
              <option value="true" ${meal?.active === false ? "" : "selected"}>Ativo</option>
              <option value="false" ${meal?.active === false ? "selected" : ""}>Inativo</option>
            </select>
          </div>
          <div class="field">
            <label for="meal-category-${id}">Categoria</label>
            <select id="meal-category-${id}" name="category">
              <option value="marmita" ${meal?.category === "marmita" ? "selected" : ""}>Marmita</option>
              <option value="buffet" ${meal?.category === "buffet" ? "selected" : ""}>Buffet</option>
              <option value="janta" ${meal?.category === "janta" ? "selected" : ""}>Janta</option>
              <option value="outro" ${!meal?.category || meal?.category === "outro" ? "selected" : ""}>Outro</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="meal-description-${id}">O que vem nessa marmita</label>
          <textarea id="meal-description-${id}" name="description" placeholder="Ex.: arroz, feijao, frango grelhado, salada e farofa">${escapeHtml(meal?.description ?? "")}</textarea>
        </div>
        <footer class="settings-actions">
          <button class="btn outline" type="button" data-close-meal-modal>Cancelar</button>
          <button class="btn primary" type="submit">${meal?.id ? "Salvar" : `${icon("plus", 15)}Cadastrar`}</button>
        </footer>
      </form>`;
  }

  function renderSettingsModals(user) {
    const state = getState();
    const supplierModalId = getSettingsSupplierModalId?.();
    const mealModalId = getSettingsMealModalId?.();
    const workSectionModalId = getSettingsWorkSectionModalId?.();
    const supplierModal = user.role === "admin" && supplierModalId
      ? renderSupplierCompanyModal(supplierModalId === "new" ? null : state.supplierCompanies?.find((supplier) => supplier.id === supplierModalId))
      : "";
    const mealModal = ["admin", "fornecedor"].includes(user.role) && mealModalId
      ? renderMealCatalogModal(mealModalId === "new" ? null : state.mealCatalog?.find((meal) => meal.id === mealModalId))
      : "";
    const workSectionModal = user.role === "admin" && workSectionModalId
      ? renderWorkSectionModal(workSectionModalId === "new" ? null : state.workSections?.find((section) => section.id === workSectionModalId))
      : "";
    return `${supplierModal}${mealModal}${workSectionModal}`;
  }

  function renderSupplierCompanyModal(supplier) {
    const title = supplier ? "Editar fornecedor" : "Novo fornecedor";
    const subtitle = supplier ? "Atualize dados formais, contato e status." : "Cadastre a empresa ou restaurante usado nas operacoes.";
    return `
      <div class="settings-modal-backdrop" data-close-supplier-modal>
        <section class="settings-modal-panel" role="dialog" aria-modal="true" aria-labelledby="supplier-modal-title" onclick="event.stopPropagation()">
          <header class="settings-modal-header">
            <div>
              <span class="compact-kicker">Fornecedor</span>
              <h2 id="supplier-modal-title">${title}</h2>
              <p>${subtitle}</p>
            </div>
            <button class="settings-modal-close" type="button" data-close-supplier-modal aria-label="Fechar">x</button>
          </header>
          ${renderSupplierCompanyForm(supplier ?? {})}
        </section>
      </div>`;
  }

  function renderMealCatalogModal(meal) {
    const title = meal ? "Editar refeicao" : "Nova refeicao";
    const subtitle = meal ? "Atualize tipo, preco, categoria e composicao." : "Cadastre tipo, preco, categoria e composicao.";
    return `
      <div class="settings-modal-backdrop" data-close-meal-modal>
        <section class="settings-modal-panel" role="dialog" aria-modal="true" aria-labelledby="meal-modal-title" onclick="event.stopPropagation()">
          <header class="settings-modal-header">
            <div>
              <span class="compact-kicker">Refeicao</span>
              <h2 id="meal-modal-title">${title}</h2>
              <p>${subtitle}</p>
            </div>
            <button class="settings-modal-close" type="button" data-close-meal-modal aria-label="Fechar">x</button>
          </header>
          ${renderMealCatalogForm(meal)}
        </section>
      </div>`;
  }

  function renderWorkSectionModal(section) {
    const state = getState();
    const leaders = state.users.filter((item) => item.role === "encarregado" && item.active !== false);
    const title = section ? "Editar efetivo" : "Novo efetivo";
    const subtitle = section ? "Atualize equipe, quantidade, area e encarregado." : "Cadastre equipe, quantidade de pessoas, area e encarregado.";
    return `
      <div class="settings-modal-backdrop" data-close-work-section-modal>
        <section class="settings-modal-panel" role="dialog" aria-modal="true" aria-labelledby="work-section-modal-title" onclick="event.stopPropagation()">
          <header class="settings-modal-header">
            <div>
              <span class="compact-kicker">Efetivo</span>
              <h2 id="work-section-modal-title">${title}</h2>
              <p>${subtitle}</p>
            </div>
            <button class="settings-modal-close" type="button" data-close-work-section-modal aria-label="Fechar">x</button>
          </header>
          ${renderWorkSectionForm(section ?? {}, leaders)}
        </section>
      </div>`;
  }

  return renderConfiguracoes;
}
