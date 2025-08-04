import WorkOrderForm from "@/components/work-order-form";

export default function WorkOrdersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Work Orders
        </h1>
        <p className="text-muted-foreground">
          Create and manage work orders. Use the AI tool below for recommendations.
        </p>
      </div>

      <div className="mt-8">
        <WorkOrderForm />
      </div>
    </div>
  );
}
