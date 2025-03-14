import ModuleCard from "../ModuleCard/ModuleCard";


const mockdata = {
    image:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Course 0',
    badge: 'Fall 2025',
    description: "XXXX - XXXX"
};
export default function DashBoard() {
    return (
        <div>
            <ModuleCard
                image={mockdata.image}
                title={mockdata.title}
                badge={mockdata.badge}
                description={mockdata.description}
            />
        </div>
    );
}