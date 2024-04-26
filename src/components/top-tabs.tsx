import { TabsTrigger, TabsList, TabsContent, Tabs } from "~/components/ui/tabs"
import TabsLandContent from "./tabs-property-content"
import { MapProvider } from 'react-map-gl';

export default function TopTabs() {
  const tabsArray = [
    { value: 'properties', title: 'Properties', component: <TabsLandContent /> },
    { value: 'events', title: 'Events', component: <div className="flex h-full items-center justify-center text-3xl">In Development</div> },
    { value: 'eat', title: 'Eat', component: <div className="flex h-full items-center justify-center text-3xl">In Development</div> },
    { value: 'sleep', title: 'Sleep', component: <div className="flex h-full items-center justify-center text-3xl">In Development</div> },
    { value: 'attractions', title: 'Visit', component: <div className="flex h-full items-center justify-center text-3xl">In Development</div> },
    { value: 'services', title: 'Services', component: <div className="flex h-full items-center justify-center text-3xl">In Development</div> },
    { value: 'goods', title: 'Goods', component: <div className="flex h-full items-center justify-center text-3xl">In Development</div> },
    { value: 'request', title: 'Request', component: <div className="flex h-full items-center justify-center text-3xl">In Development</div> },
    { value: 'invest', title: 'Invest', component: <div className="flex h-full items-center justify-center text-3xl">In Development</div> },
    { value: 'news', title: 'News', component: <div className="flex h-full items-center justify-center text-3xl">In Development</div> },
  ];

  return (
    <Tabs key="1" className="flex flex-col h-full w-full" defaultValue="properties">
      <TabsList className="grid w-full grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2">
        {tabsArray.map(tab => (
          <TabsTrigger className="" key={tab.value} value={tab.value}>{tab.title}</TabsTrigger>
        ))}
      </TabsList>
      <MapProvider>
        {tabsArray.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="w-full h-full mt-0">
            {tab.component}
          </TabsContent>
        ))}
      </MapProvider>
    </Tabs>
  )
}
