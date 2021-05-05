package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class VehicletypeData extends AbstractSeedClass {

    public VehicletypeData(){
        addIdNameData(1, "h");
        addIdNameData(2, "b");
    }

}