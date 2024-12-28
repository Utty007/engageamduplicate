import { useEffect, useState } from 'react';

interface TabItem {
  key: string;
  label: string;
  component: React.ReactNode;
  icons?: React.ReactNode;
}

interface TabProps {
  items: TabItem[];
  activeClassName?: string;
  notActiveClassName?: string;
  tabIndex?: number;
  width?: string;
}

const AppTab = ({
  items,
  tabIndex,
  activeClassName = 'bg-primary-50 text-white',
  notActiveClassName = 'bg-white text-primary-300',
  width = "w-[18rem]",
}: TabProps) => {
  const [activeTab, setActiveTab] = useState<number>(tabIndex || 0);

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setActiveTab(tabIndex || 0);
  }, [tabIndex]);

  return (
    <section className="flex flex-col w-full">
      <div className="flex flex-col gap-8">
        <div className='overflow-x-auto no-scrollbar'>
          <div className={`flex gap-2 bg-[#7878801F] py-1 pl-1 justify-start rounded-xl ${width}`}>
            {items.map((item: TabItem, index: number) => (
              <div
                key={item.key}
                onClick={() => handleTabClick(index)}
                aria-hidden="true"
                className={` px-3 py-2 ${
                  activeTab === index ? activeClassName : notActiveClassName
                }  ${index === 0 ? 'rounded-xl' : ''}
            ${index === items.length - 1 ? 'rounded-xl' : ''} flex  items-center cursor-pointer`}
              >
                {item.icons}
                <p className="text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div>{items[activeTab]?.component}</div>
      </div>
    </section>
  );
};
export default AppTab;
