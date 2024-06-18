import React from 'react';
import DuckCard from './DuckCard';
import EggCard from './EggCard';


const Home = () => {
    return (
        <div className="p-6">
            

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Card 1 */}
                <DuckCard logoUrl="/images/duck_logo.png" />
               

                {/* Card 2 */}
                <EggCard logoUrl="/images/egg_logo.png" />

                {/* Card 3 */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">Card 3</h3>
                        <p className="mt-2 text-sm text-gray-500">Content of card 3 goes here.</p>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">Card 4</h3>
                        <p className="mt-2 text-sm text-gray-500">Content of card 4 goes here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
