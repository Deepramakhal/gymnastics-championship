import React from "react";

function GradeHelper() {
    return (
        <div className="min-h-screen bg-gray-50">

            <div className="py-5 px-4 text-center">
                <h1 className="text-2xl font-bold">
                    Grade Helper
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Official Gymnastics Age Group Rules
                </p>
            </div>

            <div className="px-4 pb-6 max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <iframe
                        src="/grade-helper.pdf"
                        width="100%"
                        height="850"
                        className="border-0"
                        title="Grade Helper"
                    />
                </div>
            </div>

        </div>
    );
}

export default GradeHelper;