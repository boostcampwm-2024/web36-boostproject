import { MENU, MENU_TITLE } from '@/constants/constants'
import { X } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import logo from '@/assets/logo.svg'

import TableTool from '@/components/TableTool'
import RecordTool from '@/components/RecordTool'
import ExampleQueryTool from '@/components/ExampleQueryTool'
import { ErrorBoundary } from 'react-error-boundary'
import SidebarErrorPage from '@/pages/SideBarErrorPage'
import useToastErrorHandler from '@/hooks/error/toastErrorHandler'
import LoadingPage from '@/pages/LoadingPage'
import { useTables } from '@/hooks/query/useTableQuery'

type LeftSidebarProps = React.ComponentProps<typeof Sidebar> & {
  activeItem: (typeof MENU)[0]
  setActiveItem: React.Dispatch<React.SetStateAction<(typeof MENU)[0]>>
}

export default function LeftSidebar({
  activeItem,
  setActiveItem,
  ...props
}: LeftSidebarProps) {
  const menu = MENU.slice(0, -1)

  const tables = useTables()
  const { setOpen, toggleSidebar } = useSidebar()
  const handleError = useToastErrorHandler()

  const handleClick = (item: (typeof MENU)[0]) => {
    setActiveItem(item)
    if (activeItem.title === item.title) {
      toggleSidebar()
    } else {
      setOpen(true)
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      className="max-w-[35vw] overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <div className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
        <SidebarHeader className="pt-3.5">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <img src={logo} alt="logo" className="size-9" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {menu?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => handleClick(item)}
                      isActive={activeItem.title === item.title}
                    >
                      <item.icon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
      <Sidebar
        collapsible="none"
        className="sticky hidden flex-1 overflow-auto md:flex"
      >
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
            <button
              type="button"
              className="text-foreground"
              onClick={() => setOpen(false)}
            >
              <X className="fill-current" />
            </button>
          </div>
        </SidebarHeader>
        {tables.isLoading ? (
          <LoadingPage />
        ) : (
          <SidebarContent className="h-full">
            <SidebarGroup className="h-full p-0">
              <SidebarGroupContent className="h-full">
                {activeItem.title === MENU_TITLE.TABLE && (
                  <ErrorBoundary
                    FallbackComponent={SidebarErrorPage}
                    onReset={() => window.location.reload()}
                    onError={handleError}
                  >
                    <TableTool tableData={tables.data || []} />
                  </ErrorBoundary>
                )}
                {activeItem.title === MENU_TITLE.RECORD && (
                  <ErrorBoundary
                    FallbackComponent={SidebarErrorPage}
                    onReset={() => window.location.reload()}
                    onError={handleError}
                  >
                    <RecordTool tableData={tables.data || []} />
                  </ErrorBoundary>
                )}
                {activeItem.title === MENU_TITLE.TESTQUERY && (
                  <ErrorBoundary
                    FallbackComponent={SidebarErrorPage}
                    onReset={() => window.location.reload()}
                    onError={handleError}
                  >
                    <ExampleQueryTool />
                  </ErrorBoundary>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        )}
      </Sidebar>
    </Sidebar>
  )
}
