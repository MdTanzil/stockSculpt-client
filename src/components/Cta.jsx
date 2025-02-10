const Cta = () => {
  return (
    <section className="">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6  bg-red-50">
        <div className="mx-auto max-w-screen-sm text-center">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-primary ">
            Start your free trial today
          </h2>
          <p className="mb-6 font-light text-primary md:text-lg">
            Try StockSculpt 3 free product limit{" "}
          </p>
          <a
            href="#"
            className=" bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
          >
            Free trial for 30 days
          </a>
        </div>
      </div>
    </section>
  );
};

export default Cta;
