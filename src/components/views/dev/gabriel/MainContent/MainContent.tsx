import React, {ReactElement} from 'react';
import Introduction from './Introduction';

const MainContent = (): ReactElement => {
  return (
    <main className="w-full max-w-4xl mx-auto flex flex-col px-3 pt-16 space-y-3 text-lg lg:text-2xl font-openSans font-[600] text-ternary tracking-wider">
      {/* <Introduction /> */}
      {/* THE 3-3-3 PRINCIPLES FOR A BETTER UX (continues...) */}
      <Introduction />
    </main>
  );
}

export default MainContent;