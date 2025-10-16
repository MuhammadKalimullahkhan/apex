import { Head } from "@inertiajs/react";

const DevelopmentTeam = () => {
    return <>
        <Head title="Developers" />

        <div className="px-12 pt-12">
            <h1 className="text-3xl">Developers</h1>
            <p>Apex Wazar is designed and developed by the following team under super-vision of Mr.Abdullah</p>
        </div>

        <div className="mt-12 px-12 flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <img src="" alt="Kalimullah" />
                    </div>
                    <p className="mt-3">Muhammad Kalimullah</p>
                    <p>Full-Stack Web-developer</p>
                </div>
                <div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <img src="" alt="Sajadullah" />
                    </div>
                    <p className="mt-3">Sajad Ullah</p>
                    <p>Graphics Designer</p>
                </div>
            </div>
        </div>
    </>
}

export default DevelopmentTeam;