import { motion } from 'framer-motion';
import { InteractiveMap } from '../components/InteractiveMap';
import { PageHeader } from '../components/ui/PageHeader';
import { Map } from 'lucide-react';

export const MapPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 max-w-7xl mx-auto"
        >
            <PageHeader
                title="Verdenskort"
                subtitle="Udforsk Cor's mange riger og mysterier"
                icon={<Map size={32} />}
                breadcrumbs={[{ label: 'Hjem', path: '/' }, { label: 'Kort', path: '/map' }]}
            />

            <div className="mt-8 h-[70vh]">
                <InteractiveMap />
            </div>
        </motion.div>
    );
};
