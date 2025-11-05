export const ErrorMessage: React.FC<{msg: string}> = function ({msg}) {
    return <p className="text-danger mb-0 mt-3">Error: {msg}</p>;
};
