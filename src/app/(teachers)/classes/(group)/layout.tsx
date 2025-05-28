import AppBreadcrumb from "@/components/app-breadcrumb";

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      {/* <AppBreadcrumb /> */}
      {/* <div className="mt-4"> */}
      {children}
      {/* </div> */}
    </div>
  );
}
